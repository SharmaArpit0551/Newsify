import React, { useState } from "react";
import ReactQuill from "react-quill"; // Import react-quill
import "react-quill/dist/quill.snow.css"; // Import the styles for quill editor
import { Button } from "@/components/ui/button"; // You can customize the button or use your own
import { toast } from "sonner"; // Assuming you're using sonner for notifications

const RichTextEditor = ({ value, onChange }) => {
    const [editorValue, setEditorValue] = useState(value);

    // Define a custom image handler
    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {

                const formData = new FormData();
                formData.append("file", file);

                try {
                    const response = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                    });

                    const data = await response.json();
                    const imageUrl = data?.url;
                    if (imageUrl) {
                        const quill = window.quill;
                        const range = quill.getSelection();
                        quill.insertEmbed(range.index, "image", imageUrl);
                        onChange(quill.root.innerHTML);
                    } else {
                        toast.error("Image upload failed");
                    }
                } catch (error) {
                    toast.error("Error uploading image");
                }
            }
        };
    };

    const modules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote"],
            [{ align: [] }],
            ["link", "image"], // Add image option
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["clean"],
        ],
    };

    return (
        <div>
            <ReactQuill
                value={editorValue}
                onChange={(content) => {
                    setEditorValue(content);
                    onChange(content);  
                }}
                modules={modules}
                formats={[
                    "header",
                    "font",
                    "list",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "align",
                    "link",
                    "image",
                    "color",
                    "background",
                    "script",
                    "indent",
                ]}
            />
            {/* <Button onClick={imageHandler} variant="outline">Insert Image</Button> */}
        </div>
    );
};

export default RichTextEditor;
