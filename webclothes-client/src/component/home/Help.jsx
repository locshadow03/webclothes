import React from 'react'
import bangchung from '../img/table/chung.png';
import cannang from '../img/table/cannang.png';
import cannangquan from '../img/table/cannangquan.jpg';

const Help = () => {
  return (
    <>
        <div className = "py-5 container">
            <h5 style = {{color: 'blue'}}>Bảng size quần áo chung</h5>
            <p style = {{textAlign: 'justify'}}>Hiện nay có rất nhiều người thắc mắc về cách chọn size áo quần như: Size S,M, L là bao nhiêu? Thông thường thì size S là size nhỏ nhất, dành cho người có vóc dáng nhỏ nhắn, quần áo size S đối với nam là 48-5255-60kg còn đối với nữ là 38 - 43 kg. Size M dành cho người có vóc dáng trung bình, quần áo M đối với nam là 60-65kg, còn đối với nữ là 43-46 kg. Còn size L dành cho những ai có vóc dáng hơi đầy đặn một chút, quần áo size L đối với nam là 66 -70kg và đối với nữ là 46 - 53 kg. Các thông số này còn tùy thuộc vào kiểu quần áo, chất liệu vải sử dụng nữa, dưới đây là bảng size áo quần nam nữ để bạn tham khảo:</p>
            <div className='w-100 d-flex justify-content-center align-items-center'>
                <img src = {bangchung}></img>
            </div>

            <h5 className = 'mt-4' style = {{color: 'blue'}}>Bảng size quần áo chung</h5>
            <p style = {{textAlign: 'justify'}}>Phương pháp chọn size áo quần theo cân nặng và chiều cao được sử dụng rất phổ biến nhất hiện nay, nhiều nhất là tại các shop bán quần áo online. Chọn size quần áo theo cân nặng có độ chính xác rất cao, hơn 90% khách hàng mua áo quần online đều cảm thấy hài lòng khi chọn size bằng cách này. 
                Dưới đây là bảng size áo quần theo cân nặng và một số hướng dẫn để các bạn dễ dàng xác định size chính xác, từ đó giúp bạn dễ dàng chọn size áo quần cho mình hoặc bạn bè, người thân:</p>
            <div className='w-100 d-flex flex-column justify-content-center align-items-center'>
                <p style = {{color: 'blue'}}>Bảng size áo theo cân nặng</p>
                <img src = {cannang}></img>

                <p className='mt-4' style = {{color: 'blue'}}>Bảng size quần theo cân nặng</p>
                <img src = {cannangquan}></img>
            </div>
        </div>
    </>
  )
}

export default Help
