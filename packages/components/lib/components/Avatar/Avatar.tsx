import "./Avatar.scss";

export interface AvatarProps {
  src: string;
}

const Avatar = ({src}: AvatarProps) => {
  return (
    <img className="avatar" src={src} />
  );
};

export default Avatar;
