import CartItem from '../pages/CartItem';
import Button from '@material-ui/core/Button';
import { Wrapper } from '../pages/Cart.styles';
import { CartItemType } from '../pages/Shop';
import { Link } from 'react-router-dom';
import React from 'react';
import { routeNames } from 'routes';

type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
    buyItems: CartItemType[];
 
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
    const calculateTotal = (items: CartItemType[]) =>
        items.reduce((ack: number, item) => ack + item.amount * item.price, 0);

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
            <h2>Total: Egld {calculateTotal(cartItems).toFixed(2)}</h2>
            <div className='buy'>
                <Button>
                    <Link
                        to={routeNames.home}
                        className='btn btn-primary mt-3 text-white'
                        data-testid='loginBtn'
                    > Buy</Link>

                </Button>
            </div>
        </Wrapper>
    );

};

export default Cart;