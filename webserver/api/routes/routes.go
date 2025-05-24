package routes

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupRouter 配置所有路由
func SetupRouter() *gin.Engine {
	r := gin.Default()

	// 配置 CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // 允许所有源访问
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API 路由组
	api := r.Group("/api")
	{
		// 健康检查
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})

		// 这里可以添加更多路由组
		// 例如：用户相关路由
		// user := api.Group("/user")
		// {
		//     user.POST("/register", handlers.Register)
		//     user.POST("/login", handlers.Login)
		// }
	}

	// 静态文件服务 - 使用 /static 路径，避免与 API 路由冲突
	r.Static("/static", "./public")

	return r
}
