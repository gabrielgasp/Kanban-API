export default {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.5.0',
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
  },
};