import React from "react";
import "./AppHome.css";

function DialogBox({ dialog, setDialog }) {
  if (!dialog.show) return null;

  return (
    <div className="dialog-overlay">
      <div className={`dialog-box ${dialog.type}`}>
        {dialog.title && <h4>{dialog.title}</h4>}
        <p>{dialog.message}</p>

        <div className="dialog-buttons">
          {dialog.type === "confirm" ? (
            <>
              <button
                onClick={() => {
                  dialog.onConfirm && dialog.onConfirm();
                  setDialog({ ...dialog, show: false });
                }}
              >
                Yes
              </button>
              <button onClick={() => setDialog({ ...dialog, show: false })}>
                No
              </button>
            </>
          ) : (
            <button
              onClick={() => setDialog({ ...dialog, show: false })}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DialogBox;
