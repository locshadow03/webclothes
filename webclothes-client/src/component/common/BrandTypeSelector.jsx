import React, { useEffect, useState } from 'react'
import { getBrandTypes } from '../../api/Brand'

const BrandTypeSelector = ({handleProductInputChange, newProduct}) => {
  const[brandTypes, setBrandTypes] = useState([""])

   useEffect(() =>{
    getBrandTypes().then((data) =>{
        setBrandTypes(data)
    })
   },[]) 



  return (
    <>
    {brandTypes.length > 0 && (
        <div>
            <select required
            className='form-select'
            id = "nameBrand" name = "nameBrand"
            value={newProduct.nameBrand}
            onChange={handleProductInputChange}
            >
                <option value={""}>Select a brand type</option>
                {brandTypes.map((type, index) =>(
                    <option key = {index} value={type}>
                        {type}
                    </option>
                ))}
            </select>

        </div>
    )}
    </>
  )
}

export default BrandTypeSelector
