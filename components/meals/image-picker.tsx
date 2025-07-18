'use client';
import { useRef, useState } from 'react';
import classes from './image-picker.module.css';
import Image from 'next/image';

interface ImagePickerProps {
  label?: string;
  name: string;
}

export default function ImagePicker({ label, name }: ImagePickerProps) {
  const [image, setImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handlePickImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[0]);
      fileReader.onload = () => {
        setImage(fileReader.result as string);
      };
    } else {
      setImage(null); // Reset image if no file is selected
    }
  };

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <input
          className={classes.input}
          type="file"
          id={name}
          onChange={handleImageChange}
          name={name}
          ref={imageInputRef}
          required
          accept="image/*"
        />

        <div className={classes.preview}>
          {image && <Image src={image} alt="Selected Image" fill />}
          {!image && <p>No image selected</p>}
        </div>

        <button
          type="button"
          onClick={handlePickImage}
          className={classes.button}
        >
          Upload Image
        </button>
      </div>
    </div>
  );
}
