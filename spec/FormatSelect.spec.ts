import { QueryCollection, QueryExpression } from '../src';
// eslint-disable-next-line no-unused-vars
import { MemoryAdapter } from './TestMemoryAdapter';
import { initDatabase } from './TestMemoryDatabase';

describe('Format Select Expressions', () => {
    beforeAll(async () => {
        return await initDatabase();
    });

    it('should use QueryExpression.select()', async () => {
        const Products = new QueryCollection('Products');
        let a = new QueryExpression().select( (x: { ProductID: any; ProductName: any; Unit: any; Price: any; }) => {
            x.ProductID,
            x.ProductName,
            x.Unit,
            x.Price
        })
        .from(Products);
        let result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBeTruthy();
    });

    it('should use QueryExpression.take()', async () => {
        const Products = new QueryCollection('Products');
        let a = new QueryExpression().select( (x: { ProductID: any; ProductName: any; Unit: any; Price: any; }) => {
            x.ProductID,
            x.ProductName,
            x.Unit,
            x.Price
        })
        .from(Products)
        .take(5);
        let result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBe(5);
    });

    it('should use QueryExpression.skip()', async () => {
        const Products = new QueryCollection('Products');
        let a = new QueryExpression().select( (x: { ProductID: any; ProductName: any; Unit: any; Price: any; }) => {
            x.ProductID,
            x.ProductName,
            x.Unit,
            x.Price
        })
        .from(Products)
        .take(5)
        .skip(5);
        let result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBe(5);
    });

    it('should use QueryExpression.skip()', async () => {
        const Products = new QueryCollection('Products');
        let a = new QueryExpression().select( (x: { ProductID: any; ProductName: any; Unit: any; Price: any; }) => {
            x.ProductID,
            x.ProductName,
            x.Unit,
            x.Price
        })
        .from(Products)
        .take(5)
        .skip(5);
        let result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBe(5);
    });

    it('should use QueryExpression.count()', async () => {
        const Products = new QueryCollection('Products');
        let a = new QueryExpression().select( (x: { ProductID: any; }) => {
            x.ProductID
        })
        .from(Products)
        .count();
        let result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBeTruthy();
        expect(result[0].total).toBeTruthy();
    });

    it('should use QueryExpression.fixed()', async () => {
        let FixedProduct = new QueryCollection('FixedProduct');
        let Products = new QueryCollection('Products');
        let a = new QueryExpression().select( () => {
            return {
                ProductID: 4,
                Price: 12,
                ProductName: 'Test Product'
            }
        })
        .from(FixedProduct)
        .join(Products)
        .with((x: { ProductID: any; Category: any; }) => x.ProductID, (x: { ProductID: any; Category: any;}) => x.ProductID)
        .where( (x: any) => {
            return (<any>Products).Category === 2;
        })
        .fixed();
        let result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBeTruthy();
        // use two joins
        let Categories = new QueryCollection('Categories');
        a = new QueryExpression().select( () => {
            return {
                ProductID: 4,
                Price: 12,
                ProductName: 'Test Product'
            }
        })
        .from(FixedProduct)
        .join(Products)
        .with((x: { ProductID: any; }) => x.ProductID, (x: { ProductID: any; }) => x.ProductID)
        .join(Categories)
        .with((x: any) => (<any>Products).Category, (x: { CategoryID: any; }) => x.CategoryID)
        .where( (x: any) => {
            return (<any>Categories).CategoryName === 'Condiments';
        })
        .fixed();
        result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBeTruthy();

    });

});