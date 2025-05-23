package main

import (
	"go01/webserver/config"
	"go01/webserver/database"
	"log"
	"net/http"
)

func main() {
	// 加载配置
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	// 初始化数据库连接
	if err := database.InitDB(cfg.GetDSN()); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.CloseDB()

	// 验证数据库连接
	if err := database.DB.Ping(); err != nil {
		log.Println("数据库连接失败:", err)
	} else {
		log.Println("数据库连接成功!")
	}

	// 获取数据库名称
	dbName := cfg.DB.DBName
	log.Printf("当前连接的数据库: %s\n", dbName)

	// 测试查询
	var version string
	err = database.DB.QueryRow("SELECT VERSION()").Scan(&version)
	if err != nil {
		log.Println("查询数据库版本失败:", err)
	} else {
		log.Printf("数据库版本: %s\n", version)
	}

	// 设置静态文件服务
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", fs)

	// 启动服务器
	log.Println("Server started at :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
