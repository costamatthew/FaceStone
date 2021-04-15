import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, Link, Redirect } from 'react-router-dom';
import { Container, Btn } from './styles';
import { useServices } from '../../providers/Services';
import { userLoginSchema } from '../../Helpers/Constants/schemas';
import { TextField } from '@material-ui/core/';
import { InputStyles } from '../../Helpers/makeStyles';
import { DefaultButtonAnimation } from '../AnimationComponents/';
import Logo from '../../Helpers/Assets/logo.svg';

// ------------------------------------------------
const LoginForm = () => {
    const history = useHistory();
    const classes = InputStyles();
    const { login, auth } = useServices();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(userLoginSchema)
    });

    const handleForm = (data) => {
        login(data);

        history.push('/');
    };

    const goToHome = () => {
        history.push('/');
    };

    return !auth ? (
        <Container>
            <div className="div_svg">
                <DefaultButtonAnimation>
                    <Link to="/">
                        <img src={Logo} alt="Logo" onClick={goToHome} />
                    </Link>
                </DefaultButtonAnimation>
            </div>

            <h1>Login</h1>

            <form onSubmit={handleSubmit(handleForm)} data-testid="formTestId">
                <TextField
                    className={classes.input}
                    data-testid="emailLoginTestId"
                    name="email"
                    type="email"
                    inputProps={register('email')}
                    label="Email"
                    margin="normal"
                    variant="filled"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    className={classes.input}
                    data-testid="passwordTestId"
                    name="password"
                    type="password"
                    inputProps={register('password')}
                    label="Senha"
                    margin="normal"
                    variant="filled"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                <Btn type="submit">Login</Btn>
            </form>
            <div>
                <p>
                    Don’t have an account yet?
                    <br />
                    <Link className="link-form" to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </Container>
    ) : (
        <Redirect to="/" />
    );
};

export default LoginForm;
