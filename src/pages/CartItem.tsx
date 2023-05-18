import Button from '@material-ui/core/Button';
import React from 'react';
// Types
import {Wrapper} from '../pages/CartItem.styles';
import {Product} from "../entities/ProductEntity";
import {CartItemType} from "./Shop";

type Props = {
    item: CartItemType;
    addToCart: (clickedItem: CartItemType | Product) => void;
    removeFromCart: (id: string) => void;
    buyItems: Product[];
};

const CartItem: React.FC<Props> = ({ item, addToCart, removeFromCart }) => (
    <Wrapper>
        <div>
            <h3>{item.title}</h3>
            <div className='information'>
                <p>Price: {item.price} USD</p>
                <p>Total: {(item.amount * item.price).toFixed(2)} USD</p>
            </div>
            <div className='buttons'>
                <Button
                    size='small'
                    disableElevation
                    variant='contained'
                    onClick={() => removeFromCart(item._id)}
                >
                    -
                </Button>
                <p>{item.amount}</p>
                <Button
                    size='small'
                    disableElevation
                    variant='contained'
                    onClick={() => addToCart(item)}
                >
                    +
                </Button>
            </div>
        </div>
        <img src={item.image} alt={item.title} />
    </Wrapper>
);

export default CartItem;