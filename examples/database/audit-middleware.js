import { contextManager } from 'request-ctxt';

// Example of database middleware that automatically adds audit fields
export const createAuditMiddleware = (sequelize) => {
    sequelize.addHook('beforeCreate', (model, options) => {
        const context = contextManager.getAll();
        model.createdBy = context.userId;
        model.requestId = context.requestId;
        return model;
    });

    sequelize.addHook('beforeUpdate', (model, options) => {
        const context = contextManager.getAll();
        model.updatedBy = context.userId;
        model.lastRequestId = context.requestId;
        return model;
    });
};

// Example usage with a model
export class User extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            // Audit fields automatically populated
            createdBy: DataTypes.STRING,
            updatedBy: DataTypes.STRING,
            requestId: DataTypes.UUID,
            lastRequestId: DataTypes.UUID
        }, { sequelize });
    }
}