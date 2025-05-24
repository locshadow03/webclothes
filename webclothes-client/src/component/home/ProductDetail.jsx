import React, { useEffect, useState } from 'react'
import { getProductById } from '../../api/Product'
import { Link, useParams } from 'react-router-dom'
import { addFavoriteProduct, getAllFavorites, removeFavoriteProduct } from '../../api/FavoriteProduct'
import { toast } from 'react-toastify'
import { addCartItem } from '../../api/Cart'
import { addComment, getCommentsByProductId } from '../../api/Comment'
import Comment from './CommentItem'

const ProductDetail = () => {
    const [product, setProduct] = useState({
        name:"",
        code:"",
        nameCategory:"",
        description:"",
        price:"",
        sizeQuantities: [],
        nameBrand:"",
        disCount:"",
        imageProduct: ""

    })
    const {productId} = useParams()

  // State lưu danh sách comment của sản phẩm
  const [comments, setComments] = useState([])

  // State lưu nội dung comment mới người dùng nhập
  const [newComment, setNewComment] = useState("")

  const [selectedParentId, setSelectedParentId] = useState(null);
  const [replyToUser, setReplyToUser] = useState(null);

  const fetchComments = async () => {
  try {
    const data = await getCommentsByProductId(productId);
    setComments(data);
  } catch (error) {
    console.error("Lấy comment thất bại", error);
  }
};

  useEffect(() => {
    fetchComments(); // Gọi khi productId thay đổi
  }, [productId]);

  // Hàm xử lý khi submit comment mới
  const handleSubmitComment = async (e) => {
  e.preventDefault();

  if (!newComment.trim()) {
    toast.error("Vui lòng nhập nội dung bình luận");
    return;
  }

  try {
    const userId = localStorage.getItem("id");
    const userName = localStorage.getItem("username");

    // Nếu bạn có UI reply thì truyền parentId, nếu không thì null
    const parentId = selectedParentId || null;

    const commentData = {
      productId,
      userId,
      userName,
      content: newComment,
      parentId,
      createdAt: new Date().toISOString(),
    };

    const savedComment = await addComment(commentData);
    
    fetchComments();

    toast.success("Bình luận thành công!");

    setComments(prevComments => {
      if (parentId === null) {
        // comment cha thì thêm vào mảng gốc
        return [...prevComments, savedComment];
      } else {
        // comment con, cần thêm vào đúng vị trí comment cha
        const addReply = (commentsList) => {
          return commentsList.map(comment => {
            if (comment.id === parentId) {
              // thêm con vào đây
              const children = comment.children ? [...comment.children, savedComment] : [savedComment];
              return { ...comment, children };
            }
            if (comment.children) {
              return { ...comment, children: addReply(comment.children) };
            }
            return comment;
          });
        };
        return addReply(prevComments);
      }
    });

    setNewComment("");
    setSelectedParentId(null);
    setReplyToUser(null);
    fetchComments();

  } catch (error) {
    toast.error("Bình luận thất bại, thử lại sau!");
  }
};

const onReplyClick = (comment) => {
    setSelectedParentId(comment.id);
    setReplyToUser(comment.userName);
  };

  const onCancelReply = () => {
    setSelectedParentId(null);
    setReplyToUser(null);
  };


    const[selectedProductColor, setSelectedProductColor] = useState("");
    const paragraphs = product.description.split('-');
    const [quantity, setQuantity] = useState(1)
    const[quantityNoChange, setQuantityNoChange] = useState({})

    const [selectedSize, setSelectedSize] = useState({});
    const [selectedColor, setSelectedColor] = useState({});

  const handleColorChange = (productId, color) => {
      setSelectedColor(prevState => ({...prevState, [productId]: color}));
  }

    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const[errorMessage, setErrorMessage] = useState("")
    const[successMessage,setSuccessMessage] = useState("")

    const fetchFavorites = async () =>{
      try {
        const result = await getAllFavorites(localStorage.getItem("id"));
        const ids = result.map(item => item.id);
        setFavoriteProducts(ids)
        console.error("Failed to fetch favorites:", favoriteProducts);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    }

    const handleFavoriteClick  = async (e, productId) => {
      e.preventDefault();
      const updatedFavorites = favoriteProducts.includes(productId)
        ? favoriteProducts.filter(id => id !== productId)
        : [...favoriteProducts, productId];
      setFavoriteProducts(updatedFavorites);
  
      try {
  
        if (updatedFavorites.includes(productId)) {
          await addFavoriteProduct(localStorage.getItem("id"), productId);
          toast.success("Thêm vào danh sách yêu thích thành công!");
        } else {
          await removeFavoriteProduct(localStorage.getItem("id"), productId);
          toast.success("Xóa khỏi danh sách yêu thích thành công!");
        }
        
        setSuccessMessage("Cập nhật danh sách yêu thích thành công!");
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(error.message);
      }
    };



    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
        }).format(value);
      };

      const handleSizeChange = (productId, size) => {
        setSelectedSize(prevState => ({ ...prevState, [productId]: size }));
       const selectedSizeObj = product.sizeQuantities.find(sizeQuantity => sizeQuantity.size === size);
      const firstColor = selectedSizeObj?.colorImageProductDtos?.[0]?.color || "";

      setSelectedColor(prevState => ({
        ...prevState,
        [productId]: firstColor
      }));

      console.log("Hien thi color", selectedColor)

    };

    const handleNewCartItemClick = async (e, productId, quantity, size, color) =>{
      e.preventDefault()
      const cartId = localStorage.getItem('cartId')
      try {
        await addCartItem(cartId, productId, quantity, size, color);
          toast.success("Thêm vào giỏ hàng thành công!");
      } catch (error) {
          toast.error("Thêm vào giỏ hàng thất bại!");
      }
  };


    const increaseQuantity = () => {
      setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
      setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const [imagePreview, setImagePreview] = useState("")
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const productData = await getProductById(productId)
            setProduct(productData)
            const defaultSize = productData.sizeQuantities.length > 0 ? productData.sizeQuantities[0].size : "";
            const defaultColor = productData.sizeQuantities.length > 0 && productData.sizeQuantities[0].colorImageProductDtos.length > 0 ? productData.sizeQuantities[0].colorImageProductDtos[0].color : "";
            console.log('Hiển thị ', productData.sizeQuantities[0].colorImageProductDtos[0].color);
            setSelectedSize({[productId]: defaultSize});
            setSelectedColor({[productId]: defaultColor});
            setSelectedProductColor(
          productData.sizeQuantities.length > 0 &&
          productData.sizeQuantities[0].colorImageProductDtos.length > 0
            ? productData.sizeQuantities[0].colorImageProductDtos[0].color
            : ""
        );

            setImagePreview(`data:image/jpeg;base64,${productData.imageProduct}`)
          } catch (error) {
            console.error(error)
          }
        }
        fetchProducts ()
        fetchFavorites()
      }, [productId])

      const selectedProductSize = selectedSize[product.productId] || (product.sizeQuantities.length > 0 ? product.sizeQuantities[0].size : "");
      // const selectedProductColor = selectedColor[product.productId] || (product.sizeQuantities.length > 0 && product.sizeQuantities[0].colorImageProductDtos.length > 0 ? product.sizeQuantities[0].colorImageProductDtos[0].color : "");
  return (
    <>
        <div className = "container-fluid mx-2 mt-4" style = {{borderBottom : "1px solid rgba(0, 0 , 0 ,0.2)"}}>
            <div className = 'mb-2'>
                <Link to = "/home" style = {{textDecoration:'none', color:'#808080'}}>Trang chủ &gt; </Link>
                <Link to = "/home" style = {{textDecoration:'none', color:'#808080'}}>Sản phẩm &gt; </Link>
                <Link to = "/home" style = {{textDecoration:'none', color:'#808080'}}>Chi tiết sản phẩm</Link>
            </div>
        </div>
        <div className="container mt-4 mb-2">
        <div className="row" key = {productId}>
          <div className="col-md-6" style = {{height:'850px'}}>
            <div className = "w-100 position-relative h-100">
            <div className="h-100 w-100">
                {product.imageProduct && (
                <img
                src={product.imageProduct}
                alt={`Photo of ${product.imageProduct}`}
                style={{ width: '100%', height: '100%',objectFit: "cover"  }}
                />
                  )}
            </div>
            {product.disCount !== 0 ? <span className="position-absolute bg-danger text-white" style={{ left: '0px', top: '0px' }}>{product.percentage 
                  ? `Giảm ${product.disCount}%` 
                  : `Giảm ${formatCurrency(product.disCount)}`} </span> : ''}
          </div>
          </div>
          <div className = 'col-md-6'>
          <div className="" style = {{boxShadow: '0 4px 4px -2px rgba(0, 0, 0, 0.1)'}}>
            <h2>{product.name}</h2>
            <p className="text-muted">Mã Sản Phẩm: {product.code}</p>
            <div className="d-flex justify-content-between">
                <div className="mx-1 d-flex">
                    <p className="product-price">
                    <del style = {{fontSize:'20px'}}>{formatCurrency(product.price)}</del>
                    </p>
                    <p className="text-danger mx-3" style = {{fontSize:'20px'}}>{formatCurrency((product.price - (product.price * (product.disCount/100))))}</p>
                </div>
            </div>
            <p><strong>Danh Mục:</strong> {product.nameCategory}</p>
            <p><strong>Thương Hiệu:</strong> {product.nameBrand}</p>
            {/* <p><strong>Mô Tả:</strong> Đây là mô tả chi tiết của sản phẩm. Nó bao gồm các thông tin về chất liệu, kích thước, và các đặc điểm nổi bật khác.</p> */}
            
            <p className = 'd-flex align-items-center'><strong>Kích Thước:</strong>
            <select
                value={selectedProductSize}
                onChange={(e) => handleSizeChange(product.productId, e.target.value)}
                className="form-select text-center mx-3"
                style={{width: '100px', height: '35px',fontSize: '13px'}}
            >
                {product.sizeQuantities.map((sizeQuantity) => (
                    <option key={sizeQuantity.id} value={sizeQuantity.size} style={{ fontSize: '13px' }}>
                        {sizeQuantity.size}
                    </option>
                ))}
            </select>        
            </p>

            <p className = 'd-flex align-items-center'><strong>Màu sắc:</strong>
                <select
                  value={selectedColor[product.productId] || selectedProductColor}
                  onChange={(e) => handleColorChange(product.productId, e.target.value)}
                  className="form-select text-center mx-3"
                  style={{width: '100px', height: '35px',fontSize: '13px'}}
                >
                  {(product.sizeQuantities.find(sq => sq.size === (selectedSize[product.productId] || selectedProductSize))?.colorImageProductDtos || [])
                    .map((colorProduct) => (
                    <option key={colorProduct.id} value={colorProduct.color} style={{fontSize: '13px'}}>
                      {colorProduct.color}
                    </option>
                      ))
                      }

                </select>
            </p>
            <div>
                <span className="bi bi-star-fill" style = {{color:'orange'}}></span>
                <span className="bi bi-star-fill" style = {{color:'orange'}}></span>
                <span className="bi bi-star-fill" style = {{color:'orange'}}></span>
                <span className="bi bi-star-fill"></span>
                <span className="bi bi-star-fill"></span>
            </div>
            <div className="d-flex align-items-center mt-3">
              <button className="btn btn-outline-primary" onClick={decreaseQuantity}>-</button>
              <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="form-control mx-2 text-center"
                  style={{ width: '50px' }}
              />
              <button className="btn btn-outline-primary" onClick={increaseQuantity}>+</button>
            </div>
            <div className = 'mt-5 d-flex align-items-center pb-3 '>
                <button className=" mx-1 btn btn-primary" onClick={(e) => handleNewCartItemClick(e, product.productId, quantity, selectedProductSize, selectedProductColor || selectedColor[product.productId])}>Thêm vào giỏ hàng</button>
                <button className={`mx-4 d-flex align-items-center favorite-button ${favoriteProducts.includes(product.productId) ? 'favorited' : ''}`}
                    onClick={(e) => handleFavoriteClick(e, product.productId)}
                 style={{fontSize:'25px', backgroundColor: 'transparent', border: 'none' }}><i class="bi bi-heart-fill mx-2" style={{ color: favoriteProducts.includes(product.productId) ? 'red' : 'white' }}></i><p className = 'text-black m-0'>Yêu thích</p></button>
            </div>
          </div>
          <div className = "d-flex align-items-center justify-content-end mt-3">
            <p className= 'mx-2 mb-0'>Chia sẻ</p>
            <div className="">
              <a href="#!" className="text-dark mx-1"><i className="bi bi-facebook"></i></a>
              <a href="#!" className="text-dark mx-1"><i className="bi bi-twitter"></i></a>
              <a href="#!" className="text-dark mx-1"><i className="bi bi-instagram"></i></a>
              <a href="#!" className="text-dark mx-1"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
          </div>
        </div>

        <div className="card mt-3">
            <div className="card-header">
                <h4>Mô tả sản phẩm</h4>
            </div>
            <div className="card-body">
                {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph.trim()}</p>
                ))}
            </div>
        </div>

        <div className="mt-5">
              <h5>Bình luận</h5>
              
              {/* Comment Input */}
              <form onSubmit={handleSubmitComment} className="mb-4">
                <div className="d-flex gap-2 align-items-start">
                  <div 
                    className="rounded-circle" 
                    style={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: "#e4e6eb",
                      flexShrink: 0 
                    }}
                  />
                  <div className="flex-grow-1 position-relative">
                    {replyToUser && (
                      <div className="bg-light rounded p-2 mb-2 d-flex align-items-center">
                        <span className="text-muted">Đang trả lời {replyToUser}</span>
                        <button 
                          type="button" 
                          onClick={onCancelReply}
                          className="btn-close ms-2"
                          aria-label="Close"
                          style={{ fontSize: 10 }}
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      placeholder={replyToUser ? `Trả lời ${replyToUser}...` : "Viết bình luận..."}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{ padding: '8px 20px' }}
                    />
                    <button 
                      type="submit"
                      className="btn btn-primary rounded-pill position-absolute end-0 top-0 mt-1 me-2"
                      style={{ 
                        padding: '4px 16px',
                        fontSize: 14,
                        transform: 'translateY(10%)'
                      }}
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              </form>

              {/* Comment List */}
              <div className="mt-3">
                {comments.length === 0 && <p className="text-muted">Chưa có bình luận nào.</p>}
                
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onReplyClick={onReplyClick}
                    currentUser={localStorage.getItem("username")}
                  />
                ))}
              </div>
            </div>
            </div>
                </>
              );
            };
          


export default ProductDetail
