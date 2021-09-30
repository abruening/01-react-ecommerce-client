import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

const FileUpload = ({ values, setValues, setLoading }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const fileUpLoadAndResize = (e) => {
    let files = e.target.files;
    let allUploadedFiles = values.images;
    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (url) => {
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                {
                  image: url,
                },
                {
                  headers: {
                    authtoken: user ? user.token : "",
                  },
                }
              )
              .then((res) => {
                setLoading(false);
                allUploadedFiles.push(res.data);
                setValues({ ...values, images: allUploadedFiles });

                console.log(values.images);
              })
              .catch((err) => {
                setLoading(false);
              });
          },
          "base64"
        );
      }
    }
  };
  const handleImageRemove = (public_id) => {
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimages`,
        {
          public_id: public_id,
        },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        const { images } = values;
        let filterImages = images.filter((item) => {
          return item.public_id !== public_id;
        });
        setValues({ ...values, images: filterImages });
      })
      .catch((err) => {});
  };
  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((e) => (
            <Badge
              count="X"
              key={e.public_id}
              onClick={() => handleImageRemove(e.public_id)}
              style={{ cursor: "pointer" }}
            >
              <Avatar
                src={e.url}
                size={100}
                className="ml-3"
                shape="square"
              ></Avatar>
            </Badge>
          ))}
      </div>
      <div className="row m-1 p-1">
        <label className="btn btn-outline-info btn-raised">
          Choose File
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUpLoadAndResize}
          ></input>
        </label>
      </div>
    </>
  );
};

export default FileUpload;
