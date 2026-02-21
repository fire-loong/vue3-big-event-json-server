import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'
// 新增：引入 Prettier 插件
import prettier from 'eslint-plugin-prettier'
export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}']
  },
  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/server.js'
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly'
      }
    }
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  // 核心：把图1的 rules 全部迁移到这里
  {
    plugins: {
      prettier
    },
    rules: {
      // 1. Prettier 风格配置（作为 ESLint 警告）
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true, // 单引号
          semi: false, // 不使用分号
          printWidth: 80, // 每行宽度至多80字符
          trailingComma: 'none', // 不加对象|数组最后逗号
          endOfLine: 'auto' // 换行符号不限制（win mac 不一致）
        }
      ],
      // 2. Vue 组件名称多单词组成（忽略index.vue）
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'] // 忽略 index.vue
        }
      ],
      // 3. 关闭 props 解构的校验
      'vue/no-setup-props-destructure': 'off',
      // 4. 添加未定义变量错误提示（和图1一致）
      'no-undef': 'error'
    }
  },
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
  skipFormatting
])
