import { useGetSignedTransactions, useTrackTransactionStatus } from "@multiversx/sdk-dapp/hooks";
import CartItem from '../pages/CartItem';
import Button from '@material-ui/core/Button';
import { Wrapper } from '../pages/Cart.styles';
import { CartItemType } from './Shop/Shop';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { contractAddress } from 'config';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { routeNames } from 'routes';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { useEffect, useState } from 'react';
import { useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks/transactions/useGetSuccessfulTransactions';
import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks/transactions/useGetPendingTransactions';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import LocalStorageService from '../services/localStorageService/LocalStorageService';
import { LocalStorageKeys } from '../services/localStorageService/LocalStorageKeys';


type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
    buyItems: CartItemType[];
 
};

export const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
    const { isLoggedIn } = useGetLoginInfo();
    const navigate = useNavigate();

    const calculateTotal = (items: CartItemType[]): number => {
        let sum = 0;

        for (const item of items) {
            sum += Number(item.amount) * Number(item.price);
        }
        return sum;
    };

    const sendObjects = (items: CartItemType[]): string[] => {
        const idObject = [];
        let i=0;
        for (const item of items) {
            idObject[i++] = item.title;
        }
        return idObject;
    };


    const sendBuyTransaction = async () => {
        if (!isLoggedIn) {
            navigate('/unlock');
            return;
        }

        if (!cartItems || cartItems.length === 0 || calculateTotal(cartItems) === 0) {
            return;
        }
        console.log(sendObjects(cartItems));
        const buyTransaction = {
            value: calculateTotal(cartItems) * 1000000000000000,
            data: sendObjects(cartItems).join(" + "),
            receiver: contractAddress,
            gasLimit: '60000000'
        };
        await refreshAccount();

        const { sessionId /*, error*/ } = await sendTransactions({
            transactions: buyTransaction,
            transactionsDisplayInfo: {
                processingMessage: 'Processing Buy transaction',
                errorMessage: 'An error has occured during Buy transaction',
                successMessage: 'Buy transaction successful'
            },
            redirectAfterSign: false
        });
        if (sessionId != null) {
            LocalStorageService.setItem(LocalStorageKeys.txSessionId, sessionId);
        }
    };

    return (
        <Wrapper>
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? <p>No items in cart.</p> : null}
            {cartItems.map(item => (
                <CartItem
                    key={item.id}
                    item={item}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                    buyItems={[]}

                />
            ))}
            <h2>Total: $ {calculateTotal(cartItems).toFixed(2)}</h2>
            <div className='buy'>
                <Button onClick={sendBuyTransaction}>
                     Buy
                </Button>
            </div>
        </Wrapper>
    );

};

export default Cart;