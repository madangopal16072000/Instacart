import profilePng from "../../images/Profile.png";
import { Rating } from "@mui/material";

const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    precision: 0.5,
    readOnly: true,
  };

  return (
    <div className="reviewCard">
      <img src={profilePng} alt="user" />
      <p>{review.name}</p>
      <Rating {...options} />
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
