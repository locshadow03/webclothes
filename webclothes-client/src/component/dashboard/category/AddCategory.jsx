import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { addCategory } from '../../../api/Category'

const AddCategory = () => {

    const [newCategory, setNewCategory] = useState({
        nameCategory: "Nhập tên danh mục",
        photo: null
    })

    const [imagePreview, setImagePreview] = useState("")

    const [successMessage, setSuccessMessage] = useState("")

    const [errorMessage, setErrorMessage] = useState("")

    const handleCategoryInputChange = (e) => {
        const name = e.target.name
        let value = e.target.value
        setNewCategory({ ...newCategory, [name]: value })
    }

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        setNewCategory({ ...newCategory, photo: selectedImage })
        setImagePreview(URL.createObjectURL(selectedImage))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const success = await addCategory(newCategory.nameCategory,newCategory.photo)
            if (success !== undefined) {
                setSuccessMessage("A new category was added to the database!")
                setNewCategory({ nameCategory: "",photo: null})
                setImagePreview("")
                setErrorMessage("")
            } else {
                setErrorMessage("Error adding category")
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
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
        <div className='container'>
            <div classname = "mx-5">
                <h4 className = "mx-5 mt-5">Add category</h4>
                <form className = "mx-5 mt-5" onSubmit={handleSubmit} style = {{backgroundColor: 'white', padding: '20px',boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                    <div className='mb-3'>
                            <div className='mb-3'>
                                <label htmlFor='nameCategory' className='form-lable'>Name category</label>
                                <input id="nameCategory" name="nameCategory" type="text" className='form-control' placeholder={newCategory.nameCategory}
                                    onChange={handleCategoryInputChange}/>
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='photo' className='form-lable'>Category Photo</label>
                                <input id="photo" name="photo" type="file"
                                    className='form-control'
                                    onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Preview Category Photo"
                                            style={{ maxWidth: "300px", maxHeight: "300px" }}
                                            className='mb-3'
                                        />
                                    )}
                                
                            </div>

                            <div className="d-flex justify-content-between align-content-center mt-2">
                                <Link to = {"/dashboard/category"} className='btn btn-info'>
                                    Back
                                </Link>
                                <button className='btn btn-primary ml-5'>Save Category</button>
                            </div>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default AddCategory
