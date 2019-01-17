import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as actionTypes from '../../store/actions/shop';
import CartProduct from '../../components/Cart/CartProducts';
import CartProductTotals from '../../components/Cart/CartProductTotals';
import PropTypes from 'prop-types';

class Cart extends Component {

    state = {
        cartProductCountsState: this.props.cartProductsProp.keys()
    }

    productCountHandler = (index, event, product_in_cart_id) => {
        this.props.updateCartProductCountProp(event.target.value, product_in_cart_id)
    }

    render() {

        let cartContent = <h5>Your cart is empty. <Link to={'/'}>Please fill it up.</Link></h5>;

        if (this.props.cartTotalProp > 0) {
            console.log(this.props.cartProductsProp)
            let cartPriceCountArray = [];
            let cartProducts = this.props.cartProductsProp
                .map((productInCart, index) => {
                    // fetch product information from source based on id
                    // product information can also be stored in state
                    let productFromStore = this.props.productProps.find(product => product.id === productInCart.id);
                    cartPriceCountArray.push({price: productFromStore.price, count: productInCart.count})
                    return (
                        <CartProduct
                            key={productInCart.id}
                            productName={productFromStore.name}
                            productCategory={productFromStore.category}
                            productPhoto={productFromStore.img}
                            productPrice={productFromStore.price}
                            productCount={productInCart.count}
                            updateProductCount={(event) => this.productCountHandler(index, event, productInCart.id)}
                            removeCartProduct={() => this.props.removeProductFromCartProp(productInCart.id, productInCart.count)}
                        />
                    )
                })

            let cartTotals = <CartProductTotals
                shippingPrice={this.props.shippingPriceProp}
                subtotal={cartPriceCountArray.reduce((acc, el) => acc + (el.price * el.count), 0)}
                clearCart={() => this.props.clearProductsFromCartProp()}
            />

            cartContent = (
                <React.Fragment>
                    {cartProducts}
                    {cartTotals}
                </React.Fragment>
            )
        }

        return (
            <div className={'p-4 shop-div'}>
                {cartContent}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        productProps: state.products,
        cartTotalProp: state.cartTotal,
        cartProductsProp: state.cart,
        shippingPriceProp: state.shippingPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        removeProductFromCartProp: (productId, count) => dispatch({
            type: actionTypes.REMOVE_FROM_CART,
            productId: productId,
            productCount: count
        }),

        clearProductsFromCartProp: () => dispatch({type: actionTypes.CLEAR_CART}),

        updateCartProductCountProp: (value, productId) => dispatch({
            type: actionTypes.UPDATE_CART_PRODUCT_COUNT,
            newCountValue: productId,
            productId: productId
        })
    }
};

Cart.propTypes = {
    cartTotalProp: PropTypes.number.isRequired,
    shippingPriceProp: PropTypes.number.isRequired,
    cartProductsProp: PropTypes.array.isRequired,
    productProps: PropTypes.array.isRequired,
}


export default connect(mapStateToProps, mapDispatchToProps)(Cart);