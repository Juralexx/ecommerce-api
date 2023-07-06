import { Request, Response } from 'express'
import { ICustomer, IOrder } from '../types/types';
import OrderModel from '../models/order.model.js';
import CategoryModel from '../models/category.model.js';
import ProductModel from '../models/product.model.js';
import CustomerModel from '../models/customer.model.js';

/**
 * Function that return the calcultated statistics for the specified period
 * @param req Express Request
 * @param getStatistics Callback function that calcultate statistics for the specified period and datas
 */

async function calculateStaticsByPeriod(req: Request, getStatistics: (...args: any) => Promise<Response<any, Record<string, any>>>) {
    //Current date
    const currentDate = new Date();

    if (req.params.from === '7j') {
        //Return the last 7 dates pasted from today
        const sevenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
        await getStatistics(sevenDaysAgo, 7);
    }
    else if (req.params.from === '1m') {
        //Return the last 30 dates pasted from today
        const oneMonthAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
        await getStatistics(oneMonthAgo, 30);
    }
    else if (req.params.from === '6m') {
        //Return the last 182 dates pasted from today
        const sixMonthAgo = new Date(currentDate.setDate(currentDate.getDate() - 182));
        await getStatistics(sixMonthAgo, 182);
    }
    else if (req.params.from === '1a') {
        //Return the last 365 dates pasted from today
        const oneYearAgo = new Date(currentDate.setDate(currentDate.getDate() - 365));
        await getStatistics(oneYearAgo, 365);
    }
    else if (req.params.from === '5a') {
        //Return the last 1825 dates pasted from today
        const fiveYearsAgo = new Date(currentDate.setDate(currentDate.getDate() - 1825));
        await getStatistics(fiveYearsAgo, 1825);
    }
};

/**
 * Get total amount for the specified orders
 * @param orders Orders array
 */

function getTotalOrdersAmount(orders: IOrder[]) {
    //Keep only the orders marked as 'paid'
    const paidOrders = orders.filter(order => order.payment_status === 'paid');
    let total = 0;
    //For each order we increase the total with the order price
    for (let i = 0; i < paidOrders.length; i++) {
        total = total + paidOrders[i].price;
    };
    //Return the total with two number after comma
    return total.toFixed(2);
};

/**
 * Get amount of orders marked as 'completed', 'shipped' or 'delivered' for the specified orders
 * @param orders Orders array
 */

function getTotalOrdersCompleted(orders: IOrder[]) {
    //Keep only the orders marked as 'completed', 'shipped' or 'delivered'
    const completedOrders = orders.filter(order => order.status === 'completed' || order.status === 'shipped' || order.status === 'delivered');
    return completedOrders.length;
};

/**
 * Calculate the average price of specified orders
 * @param orders Orders array
 */

function getOrdersAveragePrice(orders: IOrder[]) {
    //Keep only the orders marked as 'paid'
    const paidOrders = orders.filter(order => order.payment_status === 'paid');
    //Initialize total variable
    let total = 0
    //For each order we increase the total with the order price
    paidOrders.forEach(order => {
        total += order.price;
    });
    //If there's a total
    if (total > 0) {
        //Divide the total by the number of orders with two number after comma
        return (total / paidOrders.length).toFixed(2);
    } else {
        return 0;
    }
}

/**
 * Function that return the orders statistics
 */

export const getOrdersStatistics = async (req: Request, res: Response) => {
    //Initialize orders array
    let orders: any[] = [];

    //Calculate orders statistics
    const getStatistics = async (from: Date, nbOfDays: number) => {
        try {
            //Get all the orders between the 'from' date and now
            await OrderModel
                .find({
                    "date": {
                        $gte: new Date(from.toString()),
                        $lte: new Date()
                    }
                })
                .then(docs => {
                    //Pass the response to the 'orders' variable
                    orders = docs;
                })
        } catch (err) {
            //Handle request errors and send them to the client
            return res.status(400).send({ message: err });
        }

        //The dataset varialbe will contains the orders classified by dates as : { ...2023-12-10: [...orders] }
        let dataset: { [key: string]: any } = {};
        //Classify each orders
        [...new Array(nbOfDays)].map((_, i) => {
            //Return the past dates decrease by one for each dates
            const date = new Date(new Date().setDate(new Date().getDate() - (i + 1))).toISOString().split('T')[0];
            //Filter the orders by the 'date' variable and store them in the 'dataset'
            dataset[date] = orders.filter((order: IOrder) => new Date(order.date).toISOString().split('T')[0] === date);
        });

        //Send the response to the client
        res.status(200).send({
            //Name for each datas in the x axis
            labels: Object.keys(dataset).map(value => value).reverse(),
            //Statistics datas
            dataset: Object.values(dataset).map(value => value.length).reverse(),
            //Get total amount for the specified orders
            totalOrdersAmount: getTotalOrdersAmount(orders),
            //Get amount of orders marked as 'completed', 'shipped' or 'delivered' for the specified orders
            totalOrdersCompleted: getTotalOrdersCompleted(orders),
            //Calculate the average price of specified orders
            ordersAveragePrice: getOrdersAveragePrice(orders),
        });
    };

    //Launch the statistics calculation
    calculateStaticsByPeriod(req, getStatistics);
}

/**
 * Calculate the average price of specified sells
 * @param daysRevenus Revenus array
 */

function getSellsAveragePrice(daysRevenus: number[]) {
    //Initialize total variable
    let total = 0;
    //For each revenus we increase the total with the sell price
    daysRevenus.forEach(revenue => {
        total += revenue;
    });
    //If there's a total
    if (total > 0) {
        //Divide the total by the number of orders with two number after comma
        return (total / daysRevenus.length).toFixed(2);
    } else {
        return 0;
    }
};

/**
 * Function that return the sells statistics
 */

export const getSellsStatistics = async (req: Request, res: Response) => {
    //Initialize orders array
    let orders: any[] = [];

    //Calculate orders statistics
    const getStatistics = async (from: Date, nbOfDays: number) => {
        try {
            //Get all the orders between the 'from' date and now
            await OrderModel
                .find({
                    "date": {
                        $gte: new Date(from.toString()),
                        $lte: new Date()
                    }
                })
                .then(docs => {
                    //Pass the response to the 'orders' variable
                    orders = docs;
                })
        } catch (err) {
            //Handle request errors and send them to the client
            return res.status(400).send({ message: err });
        }

        //The dataset varialbe will contains the day revenus classified by dates as : { ...2023-12-10: [...orders] }
        let dataset: { [key: string]: any } = {};
        //Calculate revenus for each days
        [...new Array(nbOfDays)].map((_, i) => {
            //Return the past dates decrease by one for each dates
            const date = new Date(new Date().setDate(new Date().getDate() - (i + 1))).toISOString().split('T')[0];
            //Find all the orders for the previous 'date'
            const nbOfOrdersThisDate = orders.filter((order: IOrder) => new Date(order.date).toISOString().split('T')[0] === date);
            //Initialize revenus of the day variable
            let dayRevenue = 0;
            //Increase de 'dayRevenue' for each order of the day
            nbOfOrdersThisDate.forEach((order: IOrder) => {
                dayRevenue += order.price;
            })
            //Store the total revenu of the day in the 'dataset' by the current date
            dataset[date] = dayRevenue;
        })

        //Send the response to the client
        res.status(200).send({
            //Name for each datas in the x axis
            labels: Object.keys(dataset).map(value => value).reverse(),
            //Statistics datas
            dataset: Object.values(dataset).map(value => value).reverse(),
            //Get total amount for the specified sells
            sellsOrdersAmount: getTotalOrdersAmount(orders),
            //Calculate the average price of specified sells
            sellsAveragePrice: getSellsAveragePrice(Object.values(dataset).map(value => value).reverse()),
        });
    };

    //Launch the statistics calculation
    calculateStaticsByPeriod(req, getStatistics);
}

/**
 * Calculate the total number of products sold for the specified date
 * @param orders Orders array
 */

function getTotalProductsSold(orders: IOrder[]) {
    //Initialize the number of products
    let nbOfProductsSold = 0;
    //Inscrease the number of product for each order
    orders.forEach(order => {
        order.products.forEach(product => {
            nbOfProductsSold += product.quantity
        })
    })
    //Return the total
    return nbOfProductsSold
}

/**
 * Calculate the average of products sold for each order
 * @param orders Orders array
 */

function getProductsAverageByOrder(orders: IOrder[]) {
    //Initialize total variable
    let total = 0;
    //Inscrease the number of product for each order
    orders.forEach(order => {
        order.products.forEach(product => {
            total += product.quantity;
        })
    });
    //Divide the total products by the number of orders
    return Math.round(total / orders.length);
}

/**
 * Function that return the products statistics
 */

export const getProductsStatistics = async (req: Request, res: Response) => {
    //Initialize orders array
    let orders: any[] = []

    //Calculate products statistics
    const getStatistics = async (from: Date, nbOfDays: number) => {
        try {
            //Get all the orders between the 'from' date and now
            await OrderModel
                .find({
                    "date": {
                        $gte: new Date(from.toString()),
                        $lte: new Date()
                    }
                })
                .then(docs => {
                    //Pass the response to the 'orders' variable
                    orders = docs
                })
        } catch (err) {
            //Handle request errors and send them to the client
            return res.status(400).send({ message: err })
        }

        //The dataset varialbe will contains the number of products sold classified by dates as : { ...2023-12-10: [...orders] }
        let dataset: { [key: string]: any } = {};
        //Calculate products sold for each days
        [...new Array(nbOfDays)].map((_, i) => {
            //Return the past dates decrease by one for each dates
            const date = new Date(new Date().setDate(new Date().getDate() - (i + 1))).toISOString().split('T')[0];
            //Retrieve all the orders of the previous date
            const nbOfOrdersThisDate = orders.filter((order: IOrder) => new Date(order.date).toISOString().split('T')[0] === date);
            //Initialiaze the number of products sold
            let nbOfProductsSold = 0;
            //Increase the 'nbOfProductsSold' for each order of the current date
            nbOfOrdersThisDate.forEach((order: IOrder) => {
                order.products.forEach(product => {
                    nbOfProductsSold += product.quantity;
                })
            })
            //Store the total revenu of the day in the 'dataset' by the current date
            dataset[date] = nbOfProductsSold;
        })

        //Send the response to the client
        res.status(200).send({
            //Name for each datas in the x axis
            labels: Object.keys(dataset).map(value => value).reverse(),
            //Statistics datas
            dataset: Object.values(dataset).map(value => value).reverse(),
            //Get total amount of products sold
            totalProductsSold: getTotalProductsSold(orders),
            //Calculate the average of products sold for each order
            productsAverageByOrder: getProductsAverageByOrder(orders),
        });
    };

    //Launch the statistics calculation
    calculateStaticsByPeriod(req, getStatistics);
};

/**
 * Function that return the categories statistics
 */

export const getCategoriesStatistics = async (req: Request, res: Response) => {
    //Initialize orders array
    let orders: any[] = [];
    //Initialize categories array
    let categories: any[] = [];

    //Calculate categories statistics
    const getStatistics = async (from: Date, nbOfDays: number) => {
        try {
            //Retrieve all the categories
            await CategoryModel
                .find()
                .then(docs => {
                    //Pass the response to the 'categories' variable
                    categories = docs;
                })
        } catch (err) {
            //Handle request errors and send them to the client
            return res.status(400).send({ message: err });
        };
        try {
            //Get all the orders between the 'from' date and now
            await OrderModel
                .find({
                    "date": {
                        $gte: new Date(from.toString()),
                        $lte: new Date()
                    }
                })
                .populate({
                    path: 'products.product',
                    select: '_id ref name category price stock promotion images',
                    populate: [
                        {
                            path: 'category',
                            select: '_id name parent link',
                        }
                    ]
                })
                .then(docs => {
                    //Pass the response to the 'orders' variable
                    orders = docs;
                })
        } catch (err) {
            //Handle request errors and send them to the client
            return res.status(400).send({ message: err });
        }

        //The dataset varialbe will contains the number of products sold classified by dates as : { ...2023-12-10: [...orders] }
        let dataset: { [key: string]: any } = {};

        //Initialize all the categories in the 'dataset' object as : { ...categoryName: 0 }
        categories.map(category => {
            return dataset[category.name] = 0;
        });

        //Push all the products sold for each categories in the 'dataset'
        orders.map((order: any) => {
            order.products.forEach((product: any) => {
                dataset[product.product.category.name] += product.quantity;
            });
        });

        //Send the response to the client
        res.status(200).send({
            //Name for each datas in the x axis
            labels: categories.map(category => category.name),
            //Statistics datas
            dataset: Object.values(dataset).map(value => value),
            //Specified period
            period: req.params.from
        });
    };

    //Launch the statistics calculation
    calculateStaticsByPeriod(req, getStatistics);
}

/**
 * Find the three most sold products for the specified period
 */

export const getMostSoldProducts = async (req: Request, res: Response) => {
    //Initialize orders array
    let orders: any[] = []

    //Calculate most sold products statistics
    const getStatistics = async (from: Date, nbOfDays: number) => {
        try {
            //Get all the orders between the 'from' date and now
            await OrderModel
                .find({
                    "date": {
                        $gte: new Date(from.toString()),
                        $lte: new Date()
                    }
                })
                .then(docs => {
                    //Pass the response to the 'orders' variable
                    orders = docs;
                })
        } catch (err) {
            //Handle request errors and send them to the client
            return res.status(400).send({ message: err });
        };

        //The dataset varialbe will contains the number of products sold classified by _id as : { ...[product._id]: number }
        let dataset: { [key: string]: any } = {};

        //For each orders
        orders.map((order: IOrder) => {
            //For each product in the order
            order.products.forEach(item => {
                //Initialize 'id' which will be the property name in the 'dataset'
                const id: any = item.product._id
                //If the property already exists
                if (dataset[id]) {
                    //Increase the product quantity sold
                    dataset[id] += item.quantity
                } else {
                    //Else initialize the quantity sold for this product
                    dataset[id] = item.quantity
                }
            })
        })

        //Now that we have the products and their quantities in the 'dataset' as : { ...[product._id]: number }
        //We map them to store them as { _id: product._id, quantity: product.quantity }
        //And so we will be able to sort them by quantity
        const datas = Object.entries(dataset).map(([key, value]) => {
            return { _id: key, quantity: value }
        })

        //Sort the products by quantity and keep only the three most sold (3 first elements of the array)
        const sortProductsByQuantity = datas.sort((x, y) => y.quantity - x.quantity).slice(0, 8);

        //Initialize the varialbe that will contain our databse products documents
        let mostSoldProducts: any[] = [];

        //Retrieve the three most sold products documents
        await Promise.all(sortProductsByQuantity.map(async (product, i) => {
            try {
                const response = await ProductModel
                    .findById(product._id)
                    .select('-description -content')
                    .populate('images category promotions')
                    .exec()

                //Store the product and its quantity in the 'mostSoldProducts' variable
                return mostSoldProducts = [...mostSoldProducts, { product: response, quantity: sortProductsByQuantity[i].quantity }]

            } catch (err) {
                //Handle errors and send them to the client
                return res.status(400).send({ message: err })
            }
        }))

        //Send the reponse containing the three most sold products
        res.status(200).send({
            mostSoldProducts: mostSoldProducts
        })
    }

    //Launch the statistics calculation
    calculateStaticsByPeriod(req, getStatistics)
}

/**
 * Function that return the customers statistics
 */

export const getCustomersStatistics = async (req: Request, res: Response) => {
    //Initialize customers array
    let customers: any[] = [];

    //Calculate customers statistics
    const getStatistics = async (from: Date, nbOfDays: number) => {
        try {
            //Get all the customers registered between the 'from' date and now
            await CustomerModel
                .find({
                    "registration_date": {
                        $gte: new Date(from.toString()),
                        $lte: new Date()
                    }
                })
                .then(docs => {
                    //Pass the response to the 'customers' variable
                    customers = docs;
                })
        } catch (err) {
            //Handle request errors and send them to the client
            return res.status(400).send({ message: err });
        };

        //The dataset varialbe will contains the number of registered customers classified by dates as : { ...2023-12-10: [...customers] }
        let dataset: { [key: string]: any } = {};
        //Calculate number of registered customers for each days
        [...new Array(nbOfDays)].map((_, i) => {
            //Return the past dates decrease by one for each dates
            const date = new Date(new Date().setDate(new Date().getDate() - (i + 1))).toISOString().split('T')[0];
            //Filter each customers by registration date and store them in the 'dataset'
            dataset[date] = customers.filter((customer: ICustomer) => new Date(customer.registration_date).toISOString().split('T')[0] === date);
        })

        //Send the response to the client
        res.status(200).send({
            //Name for each datas in the x axis
            labels: Object.keys(dataset).map(value => value).reverse(),
            //Statistics datas
            dataset: Object.values(dataset).map(value => value.length).reverse(),
            //Return to total of customers registered for the specified period
            totalCustomers: customers.length,
            //Return the average of registered customers for the specified period
            customersAverage: (customers.length / nbOfDays).toFixed(2)
        });
    };

    //Launch the statistics calculation
    calculateStaticsByPeriod(req, getStatistics);
};