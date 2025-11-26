function ImagePopup({ card }) {
  const { name, link } = card;

  return (
    <figure className="figure figure_card">
      <img className="figure__image" src={link} alt={name} />
      <figcaption className="figure__caption">{name}</figcaption>
    </figure>
  );
}

export default ImagePopup;
