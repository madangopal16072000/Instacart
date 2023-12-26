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
// import "./UpdateProduct.css";
import {
  selectAdminProductStatus,
  selectAdminProduct,
  selectAdminProductError,
  updateProduct,
  resetProductStatus,
  resetProductError,
} from "../../api/adminProductSlice";
import { useNavigate, useParams } from "react-router-dom";
import { resetAdminProductsStatus } from "../../api/adminProductsSlice";
import {
  getProductDetailsAdmin,
  selectAdminProductDetails,
} from "../../api/adminProductDetails";
const categories = [
  "Laptop",
  "Footwear",
  "Button",
  "Tops",
  "Attire",
  "Camera",
  "smartphone",
];

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const product = useSelector(selectAdminProductDetails);
  const status = useSelector(selectAdminProductStatus);
  const error = useSelector(selectAdminProductError);
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // dispatch(resetProductStatus());
    if (product && product._id !== productId) {
      dispatch(getProductDetailsAdmin(productId));
    } else {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.Stock);
      setOldImages(product.images);
    }
    if (error) {
      toast.error(error);
      dispatch(resetProductError());
    }

    if (status === "succeeded") {
      dispatch(resetAdminProductsStatus());
      toast.success("Product updated successfully");
      dispatch(resetProductStatus());
      navigate("/admin/dashboard");
    }
  }, [error, status, navigate, dispatch, product, productId]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", Stock);

    images.forEach((image) => {
      myForm.append("images", image);
    });

    const data = {
      id: productId,
      formData: myForm,
    };
    dispatch(updateProduct(data));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
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
            onSubmit={updateProductSubmitHandler}
          >
            <h1>Update Product</h1>
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
                value={price}
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
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
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
                value={Stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>
            <div id="createProductFormImage">
              {oldImages &&
                oldImages.map((image, index) => {
                  return (
                    <img
                      key={index}
                      src={image.url}
                      alt="old Product Preview"
                    />
                  );
                })}
            </div>
            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => {
                return <img key={index} src={image} alt="Product Preview" />;
              })}
            </div>
            <Button
              id="createProductBtn"
              type="submit"
              disabled={status === "loading" ? true : false}
            >
              Update
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;
