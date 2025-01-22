// var fs_src = `
//     precision highp float;

//     const vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
//     const vec3 specColor = vec3(1.0, 1.0, 1.0);

//     uniform vec3 lightPos;
//     uniform sampler2D texSampler;
//     uniform int textureLighting;
//     uniform float lightIntensity;

//     varying vec3 fPos;
//     varying vec3 fNormal;
//     varying vec2 texCoords;

//     vec3 normal;

//     vec3 calculate_lighting() {
//         vec3 lightDir = fPos - lightPos;
//         float distance = length(lightDir);
//         if (distance >= 1.0) {
//             distance = distance * distance;
//         } else {
//             distance = pow(distance, 0.5);
//         }
//         lightDir = normalize(lightDir);
    
//         float lambertian = max(dot(lightDir, normal), 0.0);
//         vec3 diffuse = diffuseColor * lambertian / distance;

//         // float specularCoeff = 0.0;
//         // if (lambertian > 0.0) {
//         //     vec3 viewDir = normalize(fPos);
//         //     vec3 halfDir = normalize(lightDir + viewDir);
            
//         //     float specAngle = max(dot(halfDir, normal), 0.0);
//         //     specularCoeff = pow(specAngle, 1.0);
//         // }
//         // vec3 specular = specularCoeff * specColor / distance;

//         vec3 color = diffuse; // + specular;
//         return color;
//     }

//     void main() {
//         normal = normalize(fNormal);
//         vec3 color = calculate_lighting();
//         vec4 texColor = texture2D(texSampler, texCoords);
        
//         if (textureLighting == 1) {
//             gl_FragColor = texColor;
//         } else if (textureLighting == 2) {
//             gl_FragColor = vec4(lightIntensity * color, 1.0);
//         } else if (textureLighting == 3) {
//             gl_FragColor = texColor + vec4(lightIntensity * texColor.xyz * color, 0.0);
//         }
//     }
// `;

var fs_src = `
    precision highp float;
    
    const vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
    const vec3 specColor = vec3(1.0, 1.0, 1.0);
    
    uniform vec3 lightDir;   // 平行光源的方向
    uniform sampler2D texSampler;
    uniform int textureLighting;
    uniform float lightIntensity;
    
    varying vec3 fPos;
    varying vec3 fNormal;
    varying vec2 texCoords;
    
    vec3 normal;
    
    vec3 calculate_lighting() {
        // 使用平行光源方向，而不是基于光源位置计算的方向
        vec3 lightDirection = normalize(lightDir);  // 这里使用从顶点传递来的光源方向
    
        float lambertian = max(dot(lightDirection, normal), 0.0);
        vec3 diffuse = diffuseColor * lambertian;  // 没有衰减部分
    
        // 如果需要添加镜面反射，可以恢复以下部分
        // float specularCoeff = 0.0;
        // if (lambertian > 0.0) {
        //     vec3 viewDir = normalize(fPos);
        //     vec3 halfDir = normalize(lightDirection + viewDir);
        //     float specAngle = max(dot(halfDir, normal), 0.0);
        //     specularCoeff = pow(specAngle, 1.0);
        // }
        // vec3 specular = specularCoeff * specColor;
    
        vec3 color = diffuse;  // 如果没有镜面反射，就只计算漫反射
        return color;
    }
    
    void main() {
        normal = normalize(fNormal);
        vec3 color = calculate_lighting();
        vec4 texColor = texture2D(texSampler, texCoords);
        
        if (textureLighting == 1) {
            gl_FragColor = texColor;
        } else if (textureLighting == 2) {
            gl_FragColor = vec4(lightIntensity * color, 1.0);
        } else if (textureLighting == 3) {
            gl_FragColor = texColor + vec4(lightIntensity * texColor.xyz * color, 0.0);
        }
    }
`;
