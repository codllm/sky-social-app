import { useEffect, useState } from "react";
import styles from "../styles/StoryViewer.module.css";

export const StoryViewer = ({
  stories,
  currentIndex,
  setCurrentIndex,
  closeViewer,
}) => {
  const [progress, setProgress] = useState(0);
  const currentStory = stories[currentIndex];

  useEffect(() => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);

          if (currentIndex < stories.length - 1) {
            setCurrentIndex(i => i + 1);
          } else {
            closeViewer();
          }
          return 0;
        }
        return p + 2;
      });
    }, 100);

    return () => clearInterval(interval);

  }, [currentIndex]);

  return (
    <div className={styles.storyViewerContainer}>

 
      <div className={styles.progressBarWrapper}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
        />
      </div>


      <div className={styles.storyHeader}>
        <div className={styles.authProfile}>
          <img
            src={currentStory.userPhoto || "https://via.placeholder.com/40"}
            alt={currentStory.username}
            className={styles.authProfilePic}
          />
          <span className={styles.authUsername}>
            {currentStory.username}
          </span>
        </div>

        <button
          className={styles.closeBtn}
          onClick={closeViewer}
        >
          ✕
        </button>
      </div>

  
      <div className={styles.storyImageContainer}>
        <img
          src={currentStory.storyUrl}
          alt="story"
          className={styles.storyImage}
        />
      </div>

  
      {currentIndex > 0 && (
        <button
          className={styles.leftArrow}
          onClick={() => setCurrentIndex(i => i - 1)}
        >
          ❮
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button
          className={styles.rightArrow}
          onClick={() => setCurrentIndex(i => i + 1)}
        >
          ❯
        </button>
      )}

    </div>
  );
};
