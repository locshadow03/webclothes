import React, { useEffect, useState } from 'react'
import { getCategoryTypes } from '../../api/Category'

const CategoryTypeSelector = ({handleProductInputChange, newProduct}) => {
  const[categoryTypes, setCategoryTypes] = useState([""])

   useEffect(() =>{
    getCategoryTypes().then((data) =>{
        setCategoryTypes(data)
    })
   },[]) 



  return (
    <>
    {categoryTypes.length > 0 && (
        <div>
            <select required
            className='form-select'
            id = "nameCategory" name = "nameCategory"
            value={newProduct.nameCategory}
            onChange={handleProductInputChange}
            >
                <option value={""}>Select a category type</option>
                {categoryTypes.map((type, index) =>(
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

export default CategoryTypeSelector
