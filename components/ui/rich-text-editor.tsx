"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Quote,
  Code,
  Undo,
  Redo,
  Heading,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your article content here...",
  className = "",
}: RichTextEditorProps) {
  const [editorContent, setEditorContent] = useState(value || "");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [selectedHeading, setSelectedHeading] = useState("p");
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Update parent component when content changes
  useEffect(() => {
    if (!isUpdatingRef.current) {
      onChange(editorContent);
    }
  }, [editorContent, onChange]);

  // Update editor when value prop changes
// Update heading selector based on current selection
useEffect(() => {
  const updateHeadingFromSelection = () => {
    const editor = editorRef.current;
    if (!editor) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const element = range.startContainer.parentElement;
    
    // Traverse up to find the block-level element
    let currentElement = element as HTMLElement | null;
    while (currentElement && currentElement !== editor) {
      const tagName = currentElement.tagName.toLowerCase();
      if (tagName.match(/^[h|p]/)) {
        setSelectedHeading(tagName);
        break;
      }
      currentElement = currentElement.parentElement;
    }
  };
  
  const editor = editorRef.current;
  if (editor) {
    editor.addEventListener('click', updateHeadingFromSelection);
    editor.addEventListener('keyup', updateHeadingFromSelection);
    editor.addEventListener('mouseup', updateHeadingFromSelection);
    
    return () => {
      editor.removeEventListener('click', updateHeadingFromSelection);
      editor.removeEventListener('keyup', updateHeadingFromSelection);
      editor.removeEventListener('mouseup', updateHeadingFromSelection);
    };
  }
}, []);

  // Format text functions - use onMouseDown to prevent focus loss
// Format text functions
const formatText = useCallback((command: string, value?: string) => {
  const editor = editorRef.current;
  if (!editor) return;

  // Focus the editor first
  editor.focus();
  
  // Save the current selection
  const selection = window.getSelection();
  if (!selection) return;
  
  // Execute the command
  document.execCommand(command, false, value);

  // Restore selection if it was lost
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (range.collapsed && range.startContainer === editor) {
      // If selection was lost, try to place cursor at end
      const lastChild = editor.lastChild;
      if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
        const newRange = document.createRange();
        newRange.setStart(lastChild, lastChild.textContent?.length || 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  }

  // Update state
  setTimeout(() => {
    if (!isUpdatingRef.current) {
      isUpdatingRef.current = true;
      setEditorContent(editor.innerHTML);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, 0);
}, []);

  // Handle heading change - Fixed version
// Handle heading change - Simple version using formatBlock
const handleHeadingChange = useCallback((value: string) => {
  setSelectedHeading(value);
  
  const editor = editorRef.current;
  if (!editor) return;
  
  // Focus the editor first
  editor.focus();
  
  // Use formatBlock command - this handles selection properly
  formatText("formatBlock", value);
  
  // After formatting, update the selected heading based on current context
  setTimeout(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const element = range.startContainer.parentElement;
    
    // Traverse up to find the block-level element
    let currentElement = element as HTMLElement | null;
    while (currentElement && currentElement !== editor) {
      if (currentElement.tagName.toLowerCase().match(/^[h|p]/)) {
        setSelectedHeading(currentElement.tagName.toLowerCase());
        break;
      }
      currentElement = currentElement.parentElement;
    }
  }, 0);
}, [formatText]);

  // Insert link
  const insertLink = useCallback(() => {
    if (linkUrl && linkText) {
      const editor = editorRef.current;
      if (!editor) return;

      editor.focus();
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-primary underline">${linkText}</a>`;
      document.execCommand("insertHTML", false, linkHtml);

      setTimeout(() => {
        if (!isUpdatingRef.current) {
          isUpdatingRef.current = true;
          setEditorContent(editor.innerHTML);
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 0);
        }
      }, 0);

      setIsLinkDialogOpen(false);
      setLinkUrl("");
      setLinkText("");
    }
  }, [linkUrl, linkText]);

  // Insert image
  const insertImage = useCallback((imageUrl: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    const imageHtml = `<img src="${imageUrl}" alt="Article image" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
    document.execCommand("insertHTML", false, imageHtml);

    setTimeout(() => {
      if (!isUpdatingRef.current) {
        isUpdatingRef.current = true;
        setEditorContent(editor.innerHTML);
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 0);
      }
    }, 0);
  }, []);

  // Handle file upload
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload-news-image", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to upload image");
        }

        const data = await res.json();
        insertImage(data.url);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    },
    [insertImage]
  );

  // Handle content changes
  const handleContentChange = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    if (!isUpdatingRef.current) {
      isUpdatingRef.current = true;
      const newContent = e.currentTarget.innerHTML;
      setEditorContent(newContent);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, []);

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-muted/50 border-b p-2 flex flex-wrap gap-1 items-center">
        {/* Heading Selector - Fixed */}
        <Select value={selectedHeading} onValueChange={handleHeadingChange}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="Paragraph" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">Paragraph</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="h4">Heading 4</SelectItem>
            <SelectItem value="h5">Heading 5</SelectItem>
            <SelectItem value="h6">Heading 6</SelectItem>
          </SelectContent>
        </Select>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("undo");
          }}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("redo");
          }}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("bold");
          }}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("italic");
          }}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("underline");
          }}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("insertUnorderedList");
          }}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("insertOrderedList");
          }}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("justifyLeft");
          }}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("justifyCenter");
          }}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("justifyRight");
          }}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsLinkDialogOpen(true);
          }}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          title="Insert Image"
          onMouseDown={(e) => {
            e.preventDefault();
            document.getElementById("image-upload")?.click();
          }}
        >
          <Image className="h-4 w-4" />
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("formatBlock", "blockquote");
          }}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            formatText("formatBlock", "pre");
          }}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      {/* Link Dialog */}
      {isLinkDialogOpen && (
        <div className="bg-background border p-4 m-4 rounded-lg">
          <h3 className="font-medium mb-2 text-foreground">Insert Link</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Link text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="w-full p-2 border rounded bg-background text-foreground"
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full p-2 border rounded bg-background text-foreground"
            />
            <div className="flex gap-2">
              <Button type="button" onClick={insertLink}>
                Insert
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLinkDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Content - Added scrollbar */}
      <div className="h-[400px] overflow-y-auto">
        <div
          ref={editorRef}
          id="editor-content"
          contentEditable
          className={`p-4 min-h-full focus:outline-none text-foreground prose prose-sm max-w-none
                     prose-headings:text-foreground prose-p:text-foreground 
                     prose-strong:text-foreground prose-em:text-foreground
                     prose-ul:text-foreground prose-ol:text-foreground
                     prose-li:text-foreground prose-blockquote:text-foreground
                     prose-code:text-foreground prose-pre:text-foreground
                     prose-a:text-primary empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none`}
          onInput={handleContentChange}
          suppressContentEditableWarning={true}
          data-placeholder={placeholder}
        />
      </div>
    </div>
  );
}