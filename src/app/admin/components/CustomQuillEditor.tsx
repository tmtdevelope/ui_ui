'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface CustomQuillEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const CustomQuillEditor = forwardRef((props: CustomQuillEditorProps, ref) => {
    const { value, onChange } = props;
    const quillRef = useRef<HTMLDivElement | null>(null);
    const quillInstance = useRef<Quill | null>(null);

    useImperativeHandle(ref, () => ({
        setContent: (content: string) => {
            if (quillInstance.current) {
                quillInstance.current.clipboard.dangerouslyPasteHTML(content);
            }
        }
    }));

    useEffect(() => {
        if (quillRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(quillRef.current, {
                theme: 'snow'
            });
            quillInstance.current.on('text-change', () => {
                const editorValue = quillInstance.current?.root.innerHTML || '';
                onChange(editorValue);
            });

            // Set initial value for Quill
            quillInstance.current.root.innerHTML = value;
        }
    }, [value, onChange]);

    return <div ref={quillRef} style={{ height: '200px', border: '1px solid #ccc' }} />;
});

export default CustomQuillEditor;
