export default function VideoPlayer({ videoUrl, onClose }) {
    if (!videoUrl) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] relative"
                onClick={(e) => e.stopPropagation()}
            >
                <video
                    src={videoUrl}
                    controls
                    className="w-full h-auto rounded-lg shadow-md"
                />
            </div>
        </div>
    );
}