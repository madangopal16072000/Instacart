import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import StorageIcon from "@mui/icons-material/Storage";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./NewProduct.css";
import {
  selectAdminProductStatus,
  selectAdminProduct,
  selectAdminProductError,
  createProduct,
  resetProductStatus,
  resetProductError,
} from "../../api/adminProductSlice";
import { useNavigate } from "react-router-dom";
import { resetAdminProductsStatus } from "../../api/adminProductsSlice";

const categories = [
  "Laptop",
  "Footwear",
  "Button",
  "Tops",
  "Attire",
  "Camera",
  "smartphone",
];

const NewProduct = () => {
  const dispatch = useDispatch();
  const product = useSelector(selectAdminProduct);
  const status = useSelector(selectAdminProductStatus);
  const error = useSelector(selectAdminProductError);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetProductError());
    }

    if (status === "succeeded") {
      dispatch(resetProductStatus());
      dispatch(resetAdminProductsStatus());
      toast.success("Product created successfully");
      navigate("/admin/dashboard");
    }
  }, [error, status, navigate]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", Stock);

    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(createProduct(myForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagePreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };
  return (
    <>
      <MetaData title="create product" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>
            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <DescriptionIcon />
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="10"
                rows="1"
              ></textarea>
            </div>
            <div>
              <AccountTreeIcon />
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {categories.map((cate) => {
                  return (
                    <option key={cate} value={cate}>
                      {cate}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <StorageIcon />
              <input
                type="number"
                placeholder="Stock"
                required
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/"
                onChange={createProductImagesChange}
                multiple
              />
            </div>
            <div id="createProductFormImage">
              {imagePreview.map((image, index) => {
                return <img key={index} src={image} alt="Avatar Preview" />;
              })}
            </div>
            <Button
              id="createProductBtn"
              type="submit"
              disabled={status === "loading" ? true : false}
            >
              Create
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewProduct;
