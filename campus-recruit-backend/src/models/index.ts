import sequelize from '../config/database';
import { User, UserRole } from './User';
import { Job, JobStatus, JobType } from './Job';
import { Application, ApplicationStatus } from './Application';

// Export all models
export { User, UserRole } from './User';
export { Job, JobStatus, JobType } from './Job';
export { Application, ApplicationStatus } from './Application';

// Export sequelize instance
export { default as sequelize } from '../config/database';

// Test database connection function
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Sync database function
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synchronized successfully.');
    
    // Create default admin user if database is empty
    if (force) {
      await createDefaultAdmin();
    }
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    throw error;
  }
};

// Create default admin user
const createDefaultAdmin = async (): Promise<void> => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@campusrecruit.com' } });
    
    if (!adminExists) {
      await User.create({
        email: 'admin@campusrecruit.com',
        password: 'admin123', // This will be hashed by the hook
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isActive: true,
      });
      console.log('✅ Default admin user created successfully.');
    }
  } catch (error) {
    console.error('❌ Error creating default admin user:', error);
  }
};

// Close database connection
export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed successfully.');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
};
