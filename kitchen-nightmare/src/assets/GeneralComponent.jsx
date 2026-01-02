import Orders from "./Orders.jsx";
import RestaurantLayout from "./RestaurantLayout.jsx";
function GeneralComponent(){
    return(
        <div className="container">
            <div className="orders-column">
                <Orders/>
            </div>
            <div className="layout-column">
                <RestaurantLayout/>
            </div>
        </div>
    );
}
export default GeneralComponent;