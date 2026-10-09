/** @type {import('tailwindcss').Config} */

module.exports={
    //1 CONTENT, aqui definimos las rutas de los archivos donde usare clases de tailwind
    //2 THEME
}


module.exports={
    content:[
        "./index.html",
        "./src/**/*.{vue, js, jsx, tsx}",
    ],
    theme:{
        extend:{
            colors:{
            'brand-primary':'#000022',
            'brand-secundary':'#1e293b',
            },
            frontFamily:{
                'sans':['inter','sans-seif'],
            }
        },
    },
    plugins:[],        
}    