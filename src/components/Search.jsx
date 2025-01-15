import React, { useContext, useEffect, useState } from "react";
import SearchRestaurant, { withHoc } from "./SearchRestaurant";
import { Coordinates } from "../context/contextApi";
import Dish from "./Dish";
import { useDispatch, useSelector } from "react-redux";
import { resetSimilarResDish } from "../utils/toogleSlice";
import LoadingPage from "./Loader";

function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [dishes, setDishes] = useState([]);
    const [restaurantData, setRestaurantData] = useState([]);
    const [selectedResDish, setSelectedResDish] = useState(null);
    const [similarResDishes, setSimilarResDishes] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Added state for loading

    const {
        coord: { lat, lng },
    } = useContext(Coordinates);

    const PromotedRes = withHoc(SearchRestaurant);

    const {
        isSimilarResDishes,
        city,
        resId,
        itemId,
        resLocation,
    } = useSelector((state) => state.toogleSlice.similarResDish);

    const dispatch = useDispatch();

    const filterOptions = ["Restaurant", "Dishes"];
    const [activeBtn, setActiveBtn] = useState("Dishes");

    function handleFilterBtn(filterName) {
        setActiveBtn(activeBtn === filterName ? activeBtn : filterName);
    }

    function handleSearchQuery(e) {
        let val = e.target.value;
        if (e.keyCode === 13) {
            setSearchQuery(val);
            setSelectedResDish(null);
            setDishes([]);
        }
    }

    useEffect(() => {
        if (isSimilarResDishes) {
            fetchSimilarResDishes();
        }
    }, [isSimilarResDishes]);

    async function fetchSimilarResDishes() {
        setIsLoading(true); // Start loading
        try {
            let pathname = `/city/${city}/${resLocation}`;
            let encodedPath = encodeURIComponent(pathname);

            let data = await fetch(
                `${import.meta.env.VITE_BASE_URL}/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${searchQuery}&trackingId=null&submitAction=ENTER&selectedPLTab=dish-add&restaurantMenuUrl=${encodedPath}-rest${resId}%3Fquery%3D${searchQuery}&restaurantIdOfAddedItem=${resId}&itemAdded=${itemId}`
            );
            let res = await data.json();
            setSelectedResDish(res?.data?.cards[1]);
            setSimilarResDishes(res?.data?.cards[2]?.card?.card?.cards);
            dispatch(resetSimilarResDish());
        } catch (error) {
            console.error("Error fetching similar dishes:", error);
        } finally {
            setIsLoading(false); // End loading
        }
    }

    async function fetchDishes() {
        setIsLoading(true); // Start loading
        try {
            let response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${searchQuery}&trackingId=4836a39e-ca12-654d-dc3b-2af9d645f8d7&submitAction=ENTER&queryUniqueId=7abdce29-5ac6-7673-9156-3022b0e032f0`
            );
            let res = await response.json();
    
            // Safely access nested properties
            const groupedCard = res?.data?.cards?.find(data => data?.groupedCard);
            const dishCards = groupedCard?.groupedCard?.cardGroupMap?.DISH?.cards;
    
            if (dishCards) {
                const finalData = dishCards.filter(
                    (data) => data?.card?.card?.["@type"]?.includes("food.v2.Dish")
                );
                setDishes(finalData);
            } else {
                console.warn("Dish cards not found in response:", res);
                setDishes([]); // Set dishes to an empty array if no data is found
            }
        } catch (error) {
            console.error("Error fetching dishes:", error);
            setDishes([]); // Set dishes to an empty array in case of error
        } finally {
            setIsLoading(false); // End loading
        }
    }
    

    async function fetchResaturantData() {
        setIsLoading(true); // Start loading
        try {
            let data = await fetch(
                `${import.meta.env.VITE_BASE_URL}/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${searchQuery}&trackingId=4836a39e-ca12-654d-dc3b-2af9d645f8d7&submitAction=ENTER&queryUniqueId=7abdce29-5ac6-7673-9156-3022b0e032f0&selectedPLTab=RESTAURANT`
            );
            let res = await data.json();
            const finalData = (res?.data?.cards[0]?.groupedCard?.cardGroupMap?.RESTAURANT?.cards).filter(
                (data) => data?.card?.card?.info
            );
            setRestaurantData(finalData);
        } catch (error) {
            console.error("Error fetching restaurant data:", error);
        } finally {
            setIsLoading(false); // End loading
        }
    }

    useEffect(() => {
        if (searchQuery === "") {
            return;
        }
        fetchDishes();
        fetchResaturantData();
    }, [searchQuery]);

    return (
        <div className="w-full mt-10 md:w-[800px] mx-auto">
            <div className="w-full relative">
                <i className="fi fi-rr-angle-small-left text-2xl ml-2 mt-1 absolute top-1/2 -translate-y-1/2"></i>
                <i className="fi fi-rr-search absolute top-1/2 right-0 -translate-y-1/2 mr-5"></i>
                <input
                    onKeyDown={handleSearchQuery}
                    className="border-2 w-full pl-8 py-3 text-xl focus:outline-none"
                    type="text"
                    placeholder="Search for restaurant and food"
                />
            </div>

            {!selectedResDish && (
                <div className="my-7 flex flex-wrap gap-3">
                    {filterOptions.map((filterName, i) => (
                        <button
                            key={i}
                            onClick={() => handleFilterBtn(filterName)}
                            className={
                                "filterBtn flex gap-2 " +
                                (activeBtn === filterName ? "active" : "")
                            }
                        >
                            <p>{filterName}</p>
                        </button>
                    ))}
                </div>
            )}

            <div className="w-full md:w-[800px] mt-5 grid grid-cols-1 md:grid-cols-2 bg-[#f4f5f7]">
                {isLoading ? (
                   <LoadingPage/>
                ) : selectedResDish ? (
                    <>
                        <div>
                            <p className="p-4">Item added to cart</p>
                            <Dish data={selectedResDish.card.card} />
                            <p className="p-4">
                                More dishes from this restaurant
                            </p>
                        </div>
                        <br />

                        {similarResDishes.map((data, i) => (
                            <Dish
                                key={i}
                                data={{
                                    ...data.card,
                                    restaurant:
                                        selectedResDish.card.card.restaurant,
                                }}
                            />
                        ))}
                    </>
                ) : activeBtn === "Dishes" ? (
                    dishes.map((data, i) => <Dish key={i} data={data.card.card} />)
                ) : (
                    restaurantData.map((data, i) =>
                        data?.card?.card?.info?.promoted ? (
                            <PromotedRes data={data} key={i} />
                        ) : (
                            <SearchRestaurant data={data} key={i} />
                        )
                    )
                )}
            </div>
        </div>
    );
}

export default Search;
