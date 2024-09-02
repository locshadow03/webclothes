import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEdit, FaEye, FaTrashAlt} from 'react-icons/fa';
import { CountCategory, deleteCategory, getAllCategores, getCategoryById } from '../../../api/Category';

const Admin = () => {
    const[categories, setCategories] = useState([])

    const [totalCategories, setTotalCategories] = useState(0);

    const [categoryDetail, setCategoryDetail] = useState("");

    const [successMessage, setSuccessMessage] = useState("")

    const [errorMessage, setErrorMessage] = useState("")


    const handleViewDetail = async (categoryId) => {
        try {
            const categoryData = await getCategoryById(categoryId);
            setCategoryDetail(categoryData);
        } catch (error) {
            console.error('Error fetching category detail:', error);
            setErrorMessage('Error fetching category detail');
        }
    };

    useEffect(() =>{
        fetchCategorys()
    },[])

    const fetchCategorys = async () =>{
        const response = await CountCategory();
        const result = await getAllCategores()
        setCategories(result)
        setTotalCategories(response)
    }

    const handleDelete = async(categoryId) =>{
        try{
            const result = await deleteCategory(categoryId)
            if(result === ""){
                setSuccessMessage(`Category no ${categoryId} was delete`)
                fetchCategorys()
            } else{
                console.error(`Error deleting category: ${result.message}`)
            }
        }catch(error){
            setErrorMessage(error.message)
        }

        setTimeout(() => {
            setSuccessMessage("")
            setErrorMessage("")
        }, 3000)
    }
  return (
    <>
                {successMessage && (
                        <div className="alert alert-success mx-5 mt-5" role="alert">
                            {successMessage}
                        </div>
                )}

                {errorMessage && (
                        <div className="alert alert-danger mx-5 mt-5" role="alert">
                            {errorMessage}
                        </div>
                )}
      <div className='d-flex justify-content-between align-content-center mt-5 mx-5'>
              <div className=''>
                <h4>Danh sách danh mục sản phẩm</h4>
              </div>
              <Link to = {"/dashboard/category/add/new-category"} className = "btn btn-primary">
                Add category
              </Link>
        </div>
        <p className='mx-5 my-3 fw-bold'>Tổng số danh mục: {totalCategories}</p>
      <div className = "mx-5 mt-4">
      <table className='table table-hover' style = {{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                <thead>
                    <tr className='text-center'>
                        <th>ID</th>
                        <th>Name category</th>
                        <th>Photo category</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                {categories.map((category, index) => (
                        <tr key={category.id} className='text-center'>
                            <td>{index + 1}</td>
                            <td>{category.nameCategory}</td>
                            <td>
                                {category.imageCategory && (
                                    <img
                                        src={`data:image/jpeg;base64,${category.imageCategory}`}
                                        alt={`Photo of ${category.nameCategory}`}
                                        style={{ width: '40px', height: '35px' }}
                                    />
                                )}
                            </td>
                            <td className='gap-2'>
                            <button
                                    className='btn btn-primary btn-sm mx-2' data-bs-toggle="modal" data-bs-target="#myModal" onClick={() => handleViewDetail(category.id)}>
                                    <FaEye />
                                </button>
                                <Link to = {`/dashboard/category/update/${category.id}`}>
                                    <span className='btn btn-warning btn-sm mx-2'>
                                        <FaEdit/>
                                    </span>
                                </Link>
                                <button
                                    className='btn btn-danger btn-sm mx-2'
                                    onClick = {() => handleDelete(category.id)}>
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                    ))}
                  
                </tbody>
      </table>

    <div class="modal" id="myModal">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Thông tin danh mục</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                <form className = "mx-5 mt-2">
                    <div className='mb-3'>
                            <div className='mb-3'>
                                <label htmlFor='nameCategory' className='form-lable'>Name category</label>
                                <input id="nameCategory" name="nameCategory" type="text" className='form-control' value={categoryDetail ? categoryDetail.nameCategory : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='photo' className='form-lable'>Category Photo</label>
                                <input id="photo" name="photo" type="file"
                                    className='form-control'
                                    
                                    />
                                    {categoryDetail && categoryDetail.imageCategory && (
                                        <img
                                            src={`data:image/jpeg;base64,${categoryDetail.imageCategory}`}
                                            alt={`Preview Category Photo`}
                                            style={{ maxWidth: '300px', maxHeight: '300px' }}
                                            className='mb-3'           
                                        />        
                                    )}
                                
                            </div>
                    </div>
                </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

      </div>
    </>
  )
}

export default Admin
