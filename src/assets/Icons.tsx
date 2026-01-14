interface IconProps {
  width: string | number;
  height: string | number;
  fill: string;
}

export const CameraIcon: React.FC<IconProps> = ({ width, height, fill }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={fill} className="bi bi-camera-video" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />
  </svg>
}

export const SearchIcon: React.FC<IconProps> = ({ width, height, fill }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={fill} className="bi bi-search" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
  </svg>
}

export const PlayIcon: React.FC<IconProps> = ({ width, height, fill }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={fill} className="bi bi-play-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
    <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
  </svg>
}

export const DownloadIcon: React.FC<IconProps> = ({ width, height, fill }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={fill} className="bi bi-download" viewBox="0 0 16 16">
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
  </svg>
}

export const StartRecordingIcon: React.FC<IconProps> = ({ width, height, fill }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={fill} className="bi bi-record2" viewBox="0 0 16 16">
    <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8m0 1A5 5 0 1 0 8 3a5 5 0 0 0 0 10" />
    <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
  </svg>
}

export const StopRecordingIcon: React.FC<IconProps> = ({ width, height, fill }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={fill} className="bi bi-stop-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
    <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5z" />
  </svg>
}