package config

import (
	"fmt"
	"os"
)

// Config 应用配置结构
type Config struct {
	DB struct {
		Host     string
		Port     int
		User     string
		Password string
		DBName   string
	}
}

// LoadConfig 从环境变量加载配置
func LoadConfig() (*Config, error) {
	cfg := &Config{}

	// 数据库配置
	cfg.DB.Host = getEnvOrDefault("DB_HOST", "127.0.0.1")
	cfg.DB.Port = 3306 // 默认 MySQL 端口
	cfg.DB.User = getEnvOrDefault("DB_USER", "root")
	cfg.DB.Password = getEnvOrDefault("DB_PASSWORD", "")
	cfg.DB.DBName = getEnvOrDefault("DB_NAME", "assets_3d")

	return cfg, nil
}

// getEnvOrDefault 获取环境变量，如果不存在则返回默认值
func getEnvOrDefault(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// GetDSN 获取数据库连接字符串
func (c *Config) GetDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?parseTime=true",
		c.DB.User,
		c.DB.Password,
		c.DB.Host,
		c.DB.Port,
		c.DB.DBName,
	)
}
