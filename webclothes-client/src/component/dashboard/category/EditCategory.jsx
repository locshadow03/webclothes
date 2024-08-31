import React, { useEffect, useState } from 'react'
import { getCategoryById, updateCategory } from '../../../api/Category'
import { Link, useParams } from 'react-router-dom'

const EditCategory = () => {
    const [category, setCategory] = useState({
        nameCategory:"",
        imageCategory: null
    })

    const [imagePreview, setImagePreview] = useState("")

    const [successMessage, setSuccessMessage] = useState("")

    const [errorMessage, setErrorMessage] = useState("")

    const {categoryId} = useParams()

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        setCategory({ ...category, imageCategory: selectedImage })
        setImagePreview(URL.createObjectURL(selectedImage))
    }

    const handleCategoryInputChange = (event) => {
        const {name, value} = event.target
        setCategory({...category, [name] : value})
    }
    useEffect(() => {
      const fetchCategorys = async () => {
        try {
          const categoryData = await getCategoryById(categoryId)
          setCategory(categoryData)
          setImagePreview(`data:image/jpeg;base64,${categoryData.imageCategory}`)
        } catch (error) {
          console.error(error)
        }
      }
      fetchCategorys ()
    }, [categoryId])

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
          const response = await updateCategory(categoryId, category)
          if (response.status === 200){
              setSuccessMessage("Category updated successfully!")
              setErrorMessage("")
          } else {
              setErrorMessage("Error updating category")
          }
      } catch (error) {
          setErrorMessage(error.message)
      }
  }
  return (
<>
        <div className='container'>
            <div classname = "mx-5">
                <h4 className = "mx-5 mt-5">Update category</h4>
                {successMessage && (
                        <div className="alert alert-success mx-5" role="alert">
                            {successMessage}
                        </div>
                )}

                {errorMessage && (
                        <div className="alert alert-danger mx-5" role="alert">
                            {errorMessage}
                        </div>
                )}

                <form className = "mx-5 mt-5" onSubmit={handleSubmit} style = {{backgroundColor: 'white', padding: '20px',boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                    <div className='mb-3'>
                            <div className='mb-3'>
                                <label htmlFor='nameCategory' className='form-lable'>Name category</label>
                                <input id="nameCategory" name="nameCategory" type="text" className='form-control' value={category.nameCategory}
                                    onChange={handleCategoryInputChange}/>
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='photo' className='form-lable'>Category Photo</label>
                                <input id="photo" name="photo" type="file"
                                    className='form-control'
                                    onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <img src = {imagePreview} alt="Preview Category Photo"
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

export default EditCategory
