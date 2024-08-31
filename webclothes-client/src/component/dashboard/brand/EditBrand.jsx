import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBrandById, updateBrand } from '../../../api/Brand'

const EditBrand = () => {
    const [brand, setBrand] = useState({
        nameBrand:"",
        imageBrand: ""
    })

    const [imagePreview, setImagePreview] = useState("")

    const [successMessage, setSuccessMessage] = useState("")

    const [errorMessage, setErrorMessage] = useState("")

    const {brandId} = useParams()

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        setBrand({ ...brand, imageBrand: selectedImage })
        setImagePreview(URL.createObjectURL(selectedImage))
    }

    const handleBrandInputChange = (event) => {
        const {name, value} = event.target
        setBrand({...brand, [name] : value})
    }
    useEffect(() => {
      const fetchBrands = async () => {
        try {
          const brandData = await getBrandById(brandId)
          setBrand(brandData)
          
          setImagePreview(`data:image/jpeg;base64,${brandData.imageBrand}`)
        } catch (error) {
          console.error(error)
        }
      }
      fetchBrands ()
    }, [brandId])

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
          const response = await updateBrand(brandId, brand)
          if (response.status === 200){
            setSuccessMessage("Brand updated successfully!")
            const updateBrandData = await getBrandById(brandId)
            setBrand(updateBrandData)
			setImagePreview(`data:image/jpeg;base64,${updateBrandData.imageBrand}`)
              setErrorMessage("")
          } else {
              setErrorMessage("Error updating brand")
          }
      } catch (error) {
          setErrorMessage(error.message)
      }
  }
  return (
<>
        <div className='container'>
            <div classname = "mx-5">
                <h4 className = "mx-5 mt-5">Update brand</h4>
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
                                <label htmlFor='nameBrand' className='form-lable'>Name brand</label>
                                <input id="nameBrand" name="nameBrand" type="text" className='form-control' value={brand.nameBrand}
                                    onChange={handleBrandInputChange}/>
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='photo' className='form-lable'>Brand Photo</label>
                                <input id="photo" name="photo" type="file"
                                    className='form-control'
                                    onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <img src = {imagePreview} alt="Preview Brand Photo"
                                            style={{ maxWidth: "300px", maxHeight: "300px" }}
                                            className='mb-3'
                                        />
                                    )}
                                
                            </div>

                            <div className="d-flex justify-content-between align-content-center mt-2">
                                <Link to = {"/dashboard/brand"} className='btn btn-info'>
                                    Back
                                </Link>
                                <button className='btn btn-primary ml-5'>Save Brand</button>
                            </div>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default EditBrand
