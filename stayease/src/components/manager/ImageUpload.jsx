import { useState } from "react";
import { uploadPropertyImage } from "../../services/cloudinaryService";

const ImageUpload = ({ value, onChange, error }) => {
  const fallbackImage = "/images/default-property.jpg";
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const imageUrl = await uploadPropertyImage(file);
      onChange(imageUrl);
    } catch (requestError) {
      setUploadError(requestError.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="image-upload-field">
      <label htmlFor="property-image">Property image</label>

      <div className="image-upload-actions">
        <label
          className={`image-upload-button ${uploading ? "is-disabled" : ""}`}
          htmlFor="property-image"
        >
          {uploading ? "Uploading..." : "Upload photo"}
        </label>

        <input
          id="property-image"
          className="image-upload-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      {uploading && <p className="field-help">Uploading image...</p>}
      {(error || uploadError) && (
        <p className="field-error">{uploadError || error}</p>
      )}

      <div className="image-preview">
        <img
          src={value || fallbackImage}
          alt="Property preview"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      <p className="field-help">
        JPEG, PNG or WebP. Maximum file size: 5 MB.
      </p>
    </div>
  );
};

export default ImageUpload;