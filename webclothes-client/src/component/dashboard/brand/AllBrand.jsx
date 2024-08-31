import React, { useEffect, useState } from 'react'
import { CountBrand, deleteBrand, getAllBrands, getBrandById } from '../../../api/Brand';
import { Link } from 'react-router-dom';
import { FaEdit, FaEye, FaTrashAlt} from 'react-icons/fa';

const AllBrand = () => {
    const[brands, setBrands] = useState([])

    const [totalBrands, setTotalBrands] = useState(0);

    const [brandDetail, setBrandDetail] = useState("");

    const [successMessage, setSuccessMessage] = useState("")

    const [errorMessage, setErrorMessage] = useState("")


    const handleViewDetail = async (brandId) => {
        try {
            const brandData = await getBrandById(brandId);
            setBrandDetail(brandData);
        } catch (error) {
            console.error('Error fetching brand detail:', error);
            setErrorMessage('Error fetching brand detail');
        }
    };

    useEffect(() =>{
        fetchBrands()
    },[])

    const fetchBrands = async () =>{
        const response = await CountBrand();
        const result = await getAllBrands();
        setBrands(result)
        setTotalBrands(response)
    }

    const handleDelete = async(brandId) =>{
        try{
            const result = await deleteBrand(brandId)
            if(result === ""){
                setSuccessMessage(`Brand no ${brandId} was delete`)
                fetchBrands()
            } else{
                console.error(`Error deleting brand: ${result.message}`)
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
                <h4>Danh sách các nhãn hàng</h4>
              </div>
              <Link to = "/dashboard/brand/add/new-brand" className = "btn btn-primary">
                Add brand
              </Link>
        </div>
        <p className='mx-5 my-3 fw-bold'>Tổng số thương hiệu: {totalBrands}</p>
      <div className = "mx-5 mt-4">
      <table className='table table-hover' style = {{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                <thead>
                    <tr className='text-center'>
                        <th>ID</th>
                        <th>Name brand</th>
                        <th>Photo brand</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                {brands.map((brand) => (
                        <tr key={brand.id} className='text-center'>
                            <td>{brand.id}</td>
                            <td>{brand.nameBrand}</td>
                            <td>
                                {brand.imageBrand && (
                                    <img
                                        src={`data:image/jpeg;base64,${brand.imageBrand}`}
                                        alt={`Photo of ${brand.imageBrand}`}
                                        style={{ width: '40px', height: '35px' }}
                                    />
                                )}
                            </td>
                            <td className='gap-2'>
                            <button
                                    className='btn btn-primary btn-sm mx-2' data-bs-toggle="modal" data-bs-target="#myModal" onClick={() => handleViewDetail(brand.id)}>
                                    <FaEye />
                                </button>
                                <Link to = {`/dashboard/brand/update/${brand.id}`}>
                                    <span className='btn btn-warning btn-sm mx-2'>
                                        <FaEdit/>
                                    </span>
                                </Link>
                                <button
                                    className='btn btn-danger btn-sm mx-2'
                                    onClick = {() => handleDelete(brand.id)}>
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
                    <h4 class="modal-title">Thông tin thương hiệu</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                <form className = "mx-5 mt-2">
                    <div className='mb-3'>
                            <div className='mb-3'>
                                <label htmlFor='nameBrand' className='form-lable'>Name brand</label>
                                <input id="nameBrand" name="nameBrand" type="text" className='form-control' value={brandDetail ? brandDetail.nameBrand : ''} readOnly
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='photo' className='form-lable'>Brand Photo</label>
                                <input id="photo" name="photo" type="file"
                                    className='form-control'
                                    
                                    />
                                    {brandDetail && brandDetail.imageBrand && (
                                        <img
                                            src={`data:image/jpeg;base64,${brandDetail.imageBrand}`}
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

export default AllBrand
