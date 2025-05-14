import { useState } from 'react';

export default function AnimationControlPanel({
    animationFiles,
    selectedAnimationFile,
    isPlaying,
    progress,
    duration,
    onAnimationSelect,
    onPlayPause,
    onProgressChange,
    onProgressDragStart,
    onProgressDragEnd
}) {
    const [showAnimationDropdown, setShowAnimationDropdown] = useState(false)

    return (
        <div className="playback-controls">
            <div className="animation-dropdown-container">
                <button
                    className="animation-dropdown-toggle"
                    onClick={() => setShowAnimationDropdown(!showAnimationDropdown)}
                >
                    {selectedAnimationFile.replace(/\.[^/.]+$/, '')}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 9L1 3h10z" />
                    </svg>
                </button>
                {showAnimationDropdown && (
                    <div className="animation-dropdown-list">
                        {animationFiles.map(file => (
                            <div
                                key={file}
                                className={`animation-item ${selectedAnimationFile === file ? 'selected' : ''}`}
                                onClick={() => {
                                    onAnimationSelect(file);
                                    setShowAnimationDropdown(false);
                                }}
                            >
                                {file.replace(/\.[^/.]+$/, '')}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                onClick={onPlayPause}
                className="play-button"
                title={isPlaying ? '暂停' : '播放'}
            >
                {isPlaying ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="black">
                        <rect x="2" y="2" width="2" height="8" />
                        <rect x="8" y="2" width="2" height="8" />
                    </svg>
                ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="black">
                        <polygon points="3,2 10,6 3,10" />
                    </svg>
                )}
            </button>
            <input
                type="range"
                min="0"
                max={duration}
                step="0.01"
                value={progress}
                onChange={(e) => onProgressChange(parseFloat(e.target.value))}
                onMouseDown={onProgressDragStart}
                onMouseUp={onProgressDragEnd}
                className="progress-slider"
            />
        </div>
    )
}