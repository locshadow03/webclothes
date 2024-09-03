import React, { useEffect, useState } from 'react'
import { deleteContact, getAllContact } from '../../../api/Contact';
import ProductPaginator from '../../common/ProductPaginator';
import { toast } from 'react-toastify';

const AllContact = () => {
    const[contacts, setContacts] = useState([])
    const[errorMessage, setErrorMessage] = useState()
    const[currentPage, setCurrenPage] = useState(1)
    const[contactsPerPage] = useState(8)

    const fetchContact = async () =>{
        try {
            const result = await getAllContact();
            console.error("ERROR sau khi lấy dữ liệu", result)
            setContacts(result)
        } catch (error) {
            console.error("ERROR", error.message);
        }
    }

    useEffect(() =>{
        fetchContact()
    })

    const handleDelete = async(contactId) =>{
        try{
            const result = await deleteContact(contactId)
            if(result === ""){
                toast.success("Xóa liên hệ thành công!");
                fetchContact()
            } else{
                console.error(`Error deleting contact: ${result.message}`)
            }
        }catch(error){
            setErrorMessage(error.message)
        }
    }

    const handlePaginationClick = (pageNumber) =>{
        setCurrenPage(pageNumber)
    }

    const calculateTotalPages = (usersPerPage, users) =>{
        const totalUsers = users.length
        return Math.ceil(totalUsers / usersPerPage)
    }

    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);
  return (
    <>
        <div className='mx-5 mt-5'>
            <h4>Danh sách các phản hồi từ khách hàng</h4>
            <div className = "mt-3 w-100">
                <table className='table table-hover'>
                    <thead>
                        <tr className='text-center'>
                            <th style = {{color : "#808080"}}>#</th>
                            <th style = {{color : "#808080"}}>Họ tên</th>
                            <th style = {{color : "#808080"}}>Email</th>
                            <th style = {{color : "#808080"}}>Số điện thoại</th>
                            <th style = {{color : "#808080"}}>Message</th>
                            <th style = {{color : "#808080"}}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentContacts.map((contact, index) =>(
                            <tr key = {contact.fullName} className='text-center'>
                                <td>{index + 1}</td>
                                <td>{contact.fullName}</td>
                                <td>{contact.email}</td>
                                <td>{contact.phoneNumber}</td>
                                <td>{contact.message}</td>
                                <td style = {{color: "red"}}
                                onClick={() => handleDelete(contact.id)}
                                >Delete</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ProductPaginator currentPage={currentPage} totalPages={calculateTotalPages(contactsPerPage, contacts)}
            onPageChange={handlePaginationClick} />
        </div>
    </>
  )
}

export default AllContact
