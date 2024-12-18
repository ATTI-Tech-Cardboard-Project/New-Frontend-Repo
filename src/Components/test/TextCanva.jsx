/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Input } from "../ui/input"
import DrawingControls from '../DrawingComponents/DrawingControl';
import axios from 'axios';
// import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import syntax for jwt-decode
// Import the rest of your imports

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// eslint-disable-next-line react/display-name
const Canvas = forwardRef(({ text, penSize=2, selectedTool, fontSize= 20, canvasWidth=1650, canvasHeight=750, fontFamily='Arial', selectTool, onSaveClick }, ref) => {
    const canvasRef = useRef(null);
    const colorPaletteRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const historyRef = useRef([]);
    const [format, setFormat] = useState('image/png');
    const [imageId, setImageId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [selectedColor, setSelectedColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(20);
    const [textInput, setTextInput] = useState('');
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
    const [isTextInputVisible, setIsTextInputVisible] = useState(false);

    // Handle text input display and positioning
    const handleTextToolClick = (e) => {
        if (selectedTool === 'text') {
            const { clientX, clientY } = e;
            setTextPosition({ x: clientX, y: clientY });
            setIsTextInputVisible(true);
            setTextInput('');
        }else{
            setIsTextInputVisible(false)
        }
    };

    const handleTextInputChange = (e) => setTextInput(e.target.value);

    const placeTextOnCanvas = () => {
        if (!textInput) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.font = '20px Arial';
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = selectedColor;
        context.fillText(textInput, textPosition.x, textPosition.y);
        const lineHeight = fontSize * 1.2;
        setIsTextInputVisible(false);
        setTextPosition(null);
    };

    const hideTextInput = () => {
        console.log("set to false")
        setIsTextInputVisible(false)
    }

    // Save text on Enter key press or outside click
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isTextInputVisible && !canvasRef.current.contains(e.target)) {
                placeTextOnCanvas();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isTextInputVisible, textInput]);

    // Expose the undo function and other necessary methods
    useImperativeHandle(ref, () => ({
        undoLastStroke: () => {
            if (historyRef.current.length > 0) {
                historyRef.current.pop();
                redrawCanvas();
            }
        },
    }));

    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        historyRef.current.forEach(stroke => {
            context.beginPath();
            stroke.forEach(point => context.lineTo(point.x, point.y));
            context.stroke();
        });
    };

    // Initialize canvas event listeners
    useEffect(() => {
        const selectSize = ()=>{
            if(selectedTool === 'pen'){
                hideTextInput()
                context.lineWidth = penSize
            }else if(selectedTool === 'brush'){
                hideTextInput()
                context.lineWidth = brushSize
            } else{
                context.lineWidth = brushSize
            }
        }
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.lineWidth = selectSize();
        context.strokeStyle = selectedColor;
        let currentStroke = []; // Temporary array for current stroke
        // console.log(currentStroke)


        const startDrawing = (event) => {
            setIsDrawing(true);
            const { x, y } = getPos(canvas, event);
            currentStroke = [{ x, y }]; // Start new stroke
            context.beginPath();
            context.moveTo(x, y);

            if (selectedTool === "pen") {
                // Pencil Tool
                context.strokeStyle = selectedColor;
                context.lineWidth = penSize;
                context.lineCap = "round"; // Makes it smoother
                context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
                context.stroke();
                setIsTextInputVisible(false)
              } else if (selectedTool === "brush") {
                // Brush Tool
                context.strokeStyle = selectedColor;
                context.lineWidth = brushSize; // Allows for thicker, brush-like strokes
                context.lineCap = "round";
                context.lineJoin = "round";
                context.globalAlpha = 0.6; // Add transparency for a softer effect
                context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
                context.stroke();
                setIsTextInputVisible(false)
              }else if (selectedTool === "text"){
                setIsTextInputVisible(true)
              }
        };

        const draw = (event) => {
            if (!isDrawing) return;
            const { x, y } = getPos(canvas, event);
            context.lineTo(x, y);
            context.stroke();
            currentStroke.push({ x, y }); // Add point to current stroke
        };

        const getPos = (canvas, event) => {
            const rect = canvas.getBoundingClientRect();
            const touch = event.touches ? event.touches[0] : event;
            return {
                x: (touch.clientX - rect.left) * (canvas.width / rect.width),
                y: (touch.clientY - rect.top) * (canvas.height / rect.height),
            };
        };

        const stopDrawing = () => {
            setIsDrawing(false);
            historyRef.current.push([...currentStroke]); // Save stroke to history
            currentStroke = []; // Reset current stroke
            context.globalAlpha = 1.0
            context.closePath();
        };

        // Event listeners for drawing
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);

        if (selectedTool === 'text') {
            // alert("text")
            setIsTextInputVisible(true)
            canvas.addEventListener('click', handleTextToolClick);
        }
        if (selectedTool === 'pen' || selectedTool === 'brush' || selectedTool === 'eraser' || selectedTool === 'color') {
            // alert("al")
            setIsTextInputVisible(false)
        }
        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    }, [isDrawing, selectedTool, selectedColor, brushSize]);

    //   To Make All Tool Functional From the Sidebar

    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the click is outside the color palette, switch to 'pen'
            if (colorPaletteRef.current && !colorPaletteRef.current.contains(event.target)) {
                selectTool('pen');
            }
        };

        // Add event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectTool]);

    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext('2d');
    
    //     // Set font properties
    //     ctx.font = `${fontSize}px ${fontFamily}`;
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //     const lineHeight = fontSize * 1.2; // Adjust line height as needed
    //     let words = text.split(' ');
    //     let line = '';
    //     let y = lineHeight; // Starting y position
    
    //     words.forEach((word) => {
    //       let testLine = line + word + ' ';
    //       let { width: testWidth } = ctx.measureText(testLine);
    
    //       if (testWidth > canvasWidth) {
    //         // Draw current line if it exceeds canvas width
    //         ctx.fillText(line, 0, y);
    //         line = word + ' '; // Start a new line with the current word
    //         y += lineHeight; // Move y position down for the next line
    //       } else {
    //         line = testLine;
    //       }
    //     });
    
    //     // Draw any remaining text
    //     ctx.fillText(line, 0, y);
    //   }, [text, fontSize, fontFamily, canvasWidth]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
    
        // Set font properties
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        const lineHeight = fontSize * 1.2; // Adjust line height as needed
        let words = (text || '').split(' '); // Ensure text is a string before splitting
        let line = '';
        let y = lineHeight; // Starting y position
    
        words.forEach((word) => {
          let testLine = line + word + ' ';
          let { width: testWidth } = ctx.measureText(testLine);
    
          if (testWidth > canvasWidth) {
            // Draw current line if it exceeds canvas width
            ctx.fillText(line, 0, y);
            line = word + ' '; // Start a new line with the current word
            y += lineHeight; // Move y position down for the next line
          } else {
            line = testLine;
          }
        });
    
        // Draw any remaining text
        ctx.fillText(line, 0, y);
      }, [text, fontSize, fontFamily, canvasWidth]);

    useEffect(() => {
        const context = canvasRef.current.getContext('2d');
        switch (selectedTool) {
            case 'pen':
                context.globalCompositeOperation = 'source-over';
                context.strokeStyle = 'black';
                context.lineWidth = 1;
                break;
            case 'brush':
                context.globalCompositeOperation = 'source-over';
                context.strokeStyle = 'blue';
                context.lineWidth = 5;
                break;
            case 'eraser':
                context.globalCompositeOperation = 'destination-out';
                context.lineWidth = 10;
                break;
            case 'text':
                break;
            case 'trash':
                break;
            default:
                break;
        }
    }, [selectedTool]);

    // To Save And Update Image In Database
    const saveDrawing = useCallback(() => {
        setLoading(true);
        const canvas = canvasRef.current;
        const getToken = localStorage.getItem('jwttoken');
        const headers = {
            Authorization: `Bearer ${getToken}`,
        };

        const decodedToken = jwtDecode(getToken);
        const email = decodedToken.sub;

        const dataURL = canvas.toDataURL(format); // Convert drawing to base64
        const dateCreated = new Date(); // Get the current date

        const requestData = {
            email: email,
            drawingBase64: dataURL,
            datecreated: dateCreated,
        };

        const apiUrl = imageId
            ? `${API_BASE_URL}/api/v2/image/update/${imageId}`
            : `${API_BASE_URL}/api/v2/saveDrawing`;

        axios({
            method: imageId ? 'patch' : 'post',
            url: apiUrl,
            data: requestData,
            headers,
        })
            .then((response) => {
                if (!imageId) {
                    setImageId(response.data); // Save new imageId
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error saving/updating drawing', error);
                setLoading(false);
            });
    }, [imageId, format]); // Add relevant dependencies here

    useEffect(() => {
        if (onSaveClick) {
            onSaveClick(saveDrawing, imageId, loading);
        }
    }, [onSaveClick, saveDrawing, imageId, loading]);

    const handleColorChange = (newColor) => {
        setSelectedColor(newColor);
    };


    return (
        <>
            {selectedTool === 'color' && (
                <DrawingControls
                    ref={colorPaletteRef}
                    onColorChange={handleColorChange}
                //   onBrushSizeChange={handleBrushSizeChange}
                />
            )}
            <div className='overflow-y-hidden overflow-x-hidden pt-[5rem]'>
                {/* Display the text input box */}
                {isTextInputVisible && (
                    <Input
                        type="text"
                        value={textInput}
                        onChange={handleTextInputChange}
                        placeholder='Enter Anything here'
                        className='active:border-none'
                        onKeyDown={(e) => e.key === 'Enter' && placeTextOnCanvas()}
                        style={{
                            position: 'absolute',
                            top: textPosition ? `${textPosition.y}px` : '0',
                            left: textPosition ? `${textPosition.x}px` : '0',
                            width: '15rem',
                            color: selectedColor,
                        }}
                    />
                )}

                {/* Canvas element */}
                <div className="canvas-container flex h-[90vh] w-full justify-center items-center">
                    <canvas ref={canvasRef} className='w-full h-full' width={1650} height={750} id="drawingCanvas" />
                </div>
            </div>
        </>
    );
});

export default Canvas;
