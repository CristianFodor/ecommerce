import {useGetLoginInfo} from "@multiversx/sdk-dapp/hooks";
import CartItem from '../pages/CartItem';
import {Wrapper} from '../pages/Cart.styles';
import {CartItemType} from './Shop/Shop';
import {useNavigate} from 'react-router-dom';
import React, {useState} from 'react';
import {contractAddress} from 'config';
import {refreshAccount} from '@multiversx/sdk-dapp/utils';
import {sendTransactions} from '@multiversx/sdk-dapp/services';
import LocalStorageService from '../services/localStorageService/LocalStorageService';
import {LocalStorageKeys} from '../services/localStorageService/LocalStorageKeys';
import {Product} from "../entities/ProductEntity";
import UtilsService from "../services/UtilsService";
import {useService} from "../services/config/dependencyInjectorConfig";
import {useQuery} from "react-query";
import {CreateOrderDTO, Order} from "../entities/OrderEntity";
import OrdersService from "../services/OrdersService";


type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType | Product) => void;
    removeFromCart: (id: string) => void;
    emptyCart: () => void;
    buyItems: Product[];
};


export const Cart: React.FC<Props> = ({cartItems, addToCart, removeFromCart, emptyCart}) => {
    const {isLoggedIn} = useGetLoginInfo();
    const navigate = useNavigate();

    const [pickedPaymentType, setPickedPaymentType] = useState('');
    let currValue;
    let finalValue:any;

    const [paymentValue, setPaymentValue] = useState(0);
    const [utilsService] = useService(UtilsService);
    const [ordersService] = useService(OrdersService);

    const {data: egldPrice} = useQuery({
        queryKey: [`getPrice`],
        queryFn: () => utilsService.getPrice(),
    });

    const calculateTotal = (items: CartItemType[]): number => {
        let sum = 0;

        for (const item of items) {
            sum += Number(item.amount) * Number(item.price);
        }

        return sum;
    };

    const sendObjects = (items: CartItemType[]): string[] => {
        const idObject = [];
        let i = 0;
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

        const buyTransaction = {
            value: paymentValue * 1000000000000000,
            data: sendObjects(cartItems).join(" + "),
            receiver: contractAddress,
            gasLimit: '60000000'
        };
        await refreshAccount();

        const {sessionId /*, error*/} = await sendTransactions({
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

    const createOrder = () => {
        const productDTO = [];
        for (const cartItem of cartItems) {
            productDTO.push({
                product: {
                    id: cartItem._id,
                    title: cartItem.title,
                    price: cartItem.price,
                },
                quantity: cartItem.amount,
            });
        }

        const data: CreateOrderDTO = {
            paymentType: pickedPaymentType,
            products: productDTO
        };

        ordersService.createUserOrder(data).then((data: Order) => {
            if (pickedPaymentType === "EGLD") {
                sendBuyTransaction();
            }else{
                emptyCart();
                alert("Comanda a fost plasata");
            }
        }).catch((error: any) => {
            console.log(error);
        });
    };

    const changePayment = async (paymentType: string) => {
        if (paymentType === 'EGLD') {
            currValue = (calculateTotal(cartItems) / egldPrice).toFixed(2);
            setPaymentValue(Number(currValue));
            finalValue=currValue;
            setPickedPaymentType(paymentType);
        } else {
            currValue = (calculateTotal(cartItems));
            setPaymentValue(currValue);
            finalValue=currValue;
            setPickedPaymentType(paymentType);
        }
    };

    return (
        <Wrapper>
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? <p>No items in cart.</p> : null}
            {cartItems.map(item => (
                <CartItem
                    key={item._id}
                    item={item}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                    buyItems={[]}
                />
            ))}

            {calculateTotal(cartItems) !== 0 &&
                <>
                    <div><h3>Choose payment method</h3></div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                               defaultChecked={pickedPaymentType === "USD"}
                               onClick={() => changePayment("USD")}/>
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            USD
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                               defaultChecked={pickedPaymentType === "EGLD"}
                               onClick={() => changePayment("EGLD")}/>
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                            EGLD
                        </label>
                    </div>
                    {paymentValue !== 0 &&
                        <>
                            <h2>Total: {paymentValue} {pickedPaymentType}</h2>
                            <div className='buy mt-3'>
                                <button type="button" className="btn btn-primary" onClick={createOrder}>Buy</button>
                            </div>
                        </>
                    }
                </>
            }
        </Wrapper>
    );
};

export default Cart;