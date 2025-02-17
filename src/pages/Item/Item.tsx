import Button from '@material-ui/core/Button';
import React from 'react';

import { Wrapper } from './Item.styles';
import {Product} from "../../entities/ProductEntity";

type Props = {
    item: Product;
    handleAddToCart: (clickedItem: Product) => void;
}

const Item: React.FC<Props> = ({ item, handleAddToCart }) => (
    <Wrapper>
        <img src={item.image} alt={item.title} />
        <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <h3> {item.price} USD</h3>
        </div>
        <Button onClick={() => handleAddToCart(item)}>Add to cart</Button>
    </Wrapper>
);

export default Item;