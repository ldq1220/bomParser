export function processResultSupply(batchSize = 50) {
    return new Promise((resolve) => {
        try {
            const results = []
            const resultSupplyElements = document.getElementsByClassName('result_supply')

            if (resultSupplyElements.length === 0) {
                resolve({
                    success: false,
                    data: [],
                    error: 'No elements with class "result_supply" found'
                })
                return
            }

            const elements = Array.from(resultSupplyElements)
            const totalElements = elements.length
            let processedCount = 0

            // 批量处理函数
            function processBatch() {
                const end = Math.min(processedCount + batchSize, totalElements)

                for (let i = processedCount; i < end; i++) {
                    const element = elements[i]
                    const elementData = {
                        company: element,
                        visibleLinks: [],
                        contents: [] // 初始化 contents
                    }
                    const links = element.querySelectorAll('a')

                    links.forEach((link) => {
                        // 使用更简单的显示检查
                        if (link.offsetParent !== null) {
                            elementData.visibleLinks.push(link)
                            const content = link.textContent.trim()
                            if (content) {
                                elementData.contents.push(content) // 每次添加可见链接的文本内容
                            }
                        }
                    })

                    results.push(elementData)
                }

                processedCount = end

                // 检查是否处理完成
                if (processedCount < totalElements) {
                    // 使用requestAnimationFrame来避免阻塞UI
                    requestAnimationFrame(processBatch)
                } else {
                    // 所有处理完成，返回结果
                    resolve({
                        success: true,
                        data: results,
                        error: null,
                        getAllContents: function () {
                            return this.data.reduce((acc, curr) => acc.concat(curr.contents), [])
                        }
                    })
                }
            }

            // 开始处理第一批
            requestAnimationFrame(processBatch)
        } catch (error) {
            resolve({
                success: false,
                data: [],
                error: error.message
            })
        }
    })
}
