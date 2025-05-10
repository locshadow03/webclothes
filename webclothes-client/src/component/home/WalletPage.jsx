import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaWallet } from 'react-icons/fa';
import { getWallet } from '../../api/Wallet';
import { useParams } from 'react-router-dom';

const WalletPage = () => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                console.log('Hello: ', userId)
                const response = await getWallet(userId);
                setWallet(response);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin ví:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWallet();
    }, [userId]);

    if (loading) return <div className="text-center p-5">Đang tải ví của bạn...</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow p-4 text-center">
                <h2 className="mb-4"><FaWallet /> Ví cá nhân</h2>
                {wallet ? (
                    <div>
                        <p><strong>Số dư hiện tại:</strong></p>
                        <h3 className="text-success">{wallet.balance.toLocaleString()} VNĐ</h3>
                    </div>
                ) : (
                    <p>Không tìm thấy ví cho người dùng.</p>
                )}
            </div>
        </div>
    );
};

export default WalletPage;
