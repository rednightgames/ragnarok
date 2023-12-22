import "./Avatar.scss";

export interface AvatarProps {
  src: string;
}

const Avatar = ({src}: AvatarProps) => {
  return (
    <img src={src} />
  );
};

export default Avatar;
