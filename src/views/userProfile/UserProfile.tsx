import Image from "next/image";

const UserProfile = () => {
  return (
    <div className="container">
      <br />
      <div className="columns">
        <div className="column">
          <div className="is-flex is-flex-direction-row is-justify-content-start is-align-content-center is-gap-5">
            <div>
              <figure className="image is-128x128 is-rounded">
                <Image
                  src={
                    "https://res.cloudinary.com/dvt4vznxn/image/upload/v1736465366/samples/woman-on-a-football-field.jpg"
                  }
                  alt=""
                  className="image is-128x128 is-rounded"
                  width={128}
                  height={128}
                />
              </figure>
            </div>

            <div className="is-flex is-flex-direction-column is-flex-direction-row is-justify-content-center is-align-content-center is-gap-1">
              <p className="is-size-4 has-text-weight-bold">Miguel Vásquez</p>
              <p className="is-size-6 has-text-weight-semibold">S21016338</p>
            </div>
          </div>
        </div>

        <div className="is-flex is-flex-direction-column is-flex-direction-row is-justify-content-end is-align-content-center ">
          <button className="button is-primary has-text-white">
            Editar Perfil
          </button>
        </div>
      </div>

      <hr />

      <div className="columns">
        <div className="column">
          <p className="is-size-6 has-text-weight-bold">Sobre mi</p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam
            illum dolorem maxime facere qui mollitia soluta quis ratione dolorum
            dicta eum, saepe ab porro accusamus architecto? Necessitatibus
            distinctio ducimus ab! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Necessitatibus consequuntur, animi vitae
            perferendis error perspiciatis tempora suscipit fuga possimus et,
            praesentium doloribus nam molestiae accusamus, laudantium ducimus
            quasi quidem? Maiores?
          </p>
        </div>
        <div className="column is-3">
          <p className="is-size-6 has-text-weight-bold">Datos extras</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam
            laborum a fuga dolores cum! Alias dicta ratione repudiandae
            voluptatibus quod? Magnam neque et eos deserunt aliquid veniam illum
            quo mollitia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
