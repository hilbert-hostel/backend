import { Router } from 'express'
import { join } from 'path'
import * as swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
const router = Router()
const swaggerDocument = YAML.load(join(__dirname, './docs.yml'))

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(swaggerDocument))

export { router as DocsRouter }
