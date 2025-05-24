package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// DB 全局数据库连接
var DB *sql.DB

// InitDB 初始化数据库连接
func InitDB(dataSourceName string) error {
	var err error
	DB, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		return fmt.Errorf("failed to open database: %v", err)
	}

	// 设置连接池参数
	DB.SetMaxOpenConns(25)                 // 最大连接数
	DB.SetMaxIdleConns(10)                 // 最大空闲连接数
	DB.SetConnMaxLifetime(5 * time.Minute) // 连接最大生命周期

	// 测试连接
	if err := DB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %v", err)
	}

	log.Println("Database connection pool initialized successfully")
	return nil
}

// CloseDB 关闭数据库连接
func CloseDB() error {
	if DB != nil {
		if err := DB.Close(); err != nil {
			return fmt.Errorf("failed to close database: %v", err)
		}
		log.Println("Database connection closed successfully")
	}
	return nil
}

// IsConnected 检查数据库连接状态
func IsConnected() bool {
	if DB == nil {
		return false
	}
	err := DB.Ping()
	return err == nil
}

// WithTransaction 执行事务
func WithTransaction(fn func(*sql.Tx) error) error {
	tx, err := DB.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}

	defer func() {
		if p := recover(); p != nil {
			// 发生panic时回滚事务
			if err := tx.Rollback(); err != nil {
				log.Printf("Error rolling back transaction: %v", err)
			}
			panic(p) // 重新抛出panic
		}
	}()

	if err := fn(tx); err != nil {
		// 发生错误时回滚事务
		if rbErr := tx.Rollback(); rbErr != nil {
			return fmt.Errorf("tx error: %v, rollback error: %v", err, rbErr)
		}
		return err
	}

	// 提交事务
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %v", err)
	}

	return nil
}

// QueryRow 执行单行查询
func QueryRow(query string, args ...interface{}) *sql.Row {
	return DB.QueryRow(query, args...)
}

// Query 执行多行查询
func Query(query string, args ...interface{}) (*sql.Rows, error) {
	return DB.Query(query, args...)
}

// Exec 执行更新操作
func Exec(query string, args ...interface{}) (sql.Result, error) {
	return DB.Exec(query, args...)
}

// GetStats 获取数据库连接池统计信息
func GetStats() sql.DBStats {
	return DB.Stats()
}
